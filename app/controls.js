(() => {
  'use strict';

  const MAX_ALGORITHM_LENGTH = 2000;
  const MAX_PENDING_MOVES = 500;
  const MOVE_EPSILON = 0.1;

  const MOVE_TOKEN = /^(Rw|Lw|Uw|Dw|Fw|Bw|[RLUDFBrludfbMESxyz])(2|')?$/;

  let queueHead = 0;
  let THREE = null;
  let camera = null;
  let lastFrontAxis = null;
  let moveHistory = [];
  let pendingUndoMoves = 0;

  window.moveQueue = [];

  function reportStatus(message, isError = false) {
    if (typeof window.reportCubeStatus === 'function') {
      window.reportCubeStatus(message, isError);
    } else {
      console[isError ? 'error' : 'info'](message);
    }
  }

  function enqueueUndoMove(token) {
    const pending = window.moveQueue.length - queueHead;

    if (pending + 1 > MAX_PENDING_MOVES) {
      throw new Error(`The move queue is limited to ${MAX_PENDING_MOVES} moves.`);
    }

    compactQueueIfNeeded();

    const insertAt = queueHead + pendingUndoMoves;
    window.moveQueue.splice(insertAt, 0, token);
    pendingUndoMoves++;
  }

  function recordExecutedMove(token) {
    if (pendingUndoMoves > 0) {
      pendingUndoMoves--;
      return;
    }

    moveHistory.push(token);
  }

  function invertMove(token) {
    if (token.endsWith('2')) return token;
    if (token.endsWith("'")) return token.slice(0, -1);
    return `${token}'`;
  }

  function undoCubeMove() {
    const previousMove = moveHistory.pop();

    if (!previousMove) {
      reportStatus('There is no move to undo.');
      return;
    }

    try {
      enqueueUndoMove(invertMove(previousMove));
      reportStatus(`Undo queued for ${previousMove}.`);
    } catch (error) {
      moveHistory.push(previousMove);
      reportStatus(error.message, true);
    }
  }

  function clearMoveHistory() {
    moveHistory = [];
    pendingUndoMoves = 0;
  }

  function parseMove(token) {
    if (typeof token !== 'string') {
      throw new Error('Move must be text.');
    }

    const match = MOVE_TOKEN.exec(token);
    if (!match) {
      throw new Error(`Invalid move: "${token}"`);
    }

    const symbol = match[1];
    const wide = symbol.endsWith('w') || /^[rludfb]$/.test(symbol);
    const face = symbol.endsWith('w') ? symbol[0].toLowerCase() : symbol;

    return {
      token,
      face,
      wide,
      prime: match[2] === "'",
      double: match[2] === '2'
    };
  }

  function compactQueueIfNeeded() {
    if (
      queueHead > 0 &&
      (queueHead >= window.moveQueue.length / 2 || queueHead > 128)
    ) {
      window.moveQueue = window.moveQueue.slice(queueHead);
      queueHead = 0;
    }
  }

  function enqueueMoves(tokens) {
    const pending = window.moveQueue.length - queueHead;

    if (pending + tokens.length > MAX_PENDING_MOVES) {
      throw new Error(`The move queue is limited to ${MAX_PENDING_MOVES} moves.`);
    }

    compactQueueIfNeeded();
    window.moveQueue.push(...tokens);
  }

  function takeNextMove() {
    if (queueHead >= window.moveQueue.length) {
      window.moveQueue.length = 0;
      queueHead = 0;
      return null;
    }

    return window.moveQueue[queueHead++];
  }

  function clearMoveQueue() {
    window.moveQueue.length = 0;
    queueHead = 0;
    pendingUndoMoves = 0;
  }

  function queueMove(token) {
    try {
      const move = parseMove(token);
      enqueueMoves([move.token]);
      reportStatus(`Queued ${move.token}.`);
    } catch (error) {
      reportStatus(error.message, true);
    }
  }

  function applyAlgorithm() {
    const input = document.getElementById('alg-input');

    if (!input) {
      reportStatus('Algorithm input was not found.', true);
      return;
    }

    const raw = input.value.replace(/[\u2018\u2019]/g, "'").trim();

    if (raw.length > MAX_ALGORITHM_LENGTH) {
      reportStatus(
        `Algorithm exceeds the ${MAX_ALGORITHM_LENGTH}-character limit.`,
        true
      );
      return;
    }

    const tokens = raw ? raw.split(/\s+/) : [];

    try {
      const moves = tokens.map(parseMove);
      enqueueMoves(moves.map(move => move.token));
      reportStatus(
        moves.length
          ? `Queued ${moves.length} move${moves.length === 1 ? '' : 's'}.`
          : 'Enter an algorithm first.'
      );
    } catch (error) {
      reportStatus(error.message, true);
    }
  }

  function scrambleCube() {
    const faces = ['R', 'L', 'U', 'D', 'F', 'B', 'M', 'E', 'S'];
    const modifiers = ['', "'", '2'];
    const moves = [];

    for (let i = 0; i < 20; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      moves.push(face + modifier);
    }

    try {
      enqueueMoves(moves);
      reportStatus('Queued a 20-move scramble.');
    } catch (error) {
      reportStatus(error.message, true);
    }
  }

  function configure(three, cubeCamera) {
    THREE = three;
    camera = cubeCamera;
    lastFrontAxis = new THREE.Vector3(0, 0, 1);
  }

  function getRelativeDirections() {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    cameraPosition.y = 0;

    if (cameraPosition.lengthSq() > 1e-6) {
      if (Math.abs(cameraPosition.x) > Math.abs(cameraPosition.z)) {
        lastFrontAxis.set(Math.sign(cameraPosition.x), 0, 0);
      } else {
        lastFrontAxis.set(0, 0, Math.sign(cameraPosition.z));
      }
    }

    const U = new THREE.Vector3(0, 1, 0);
    const F = lastFrontAxis.clone();
    const R = new THREE.Vector3().crossVectors(U, F).normalize();

    return { R, F, U };
  }

  function getTurnParameters(token, step = window.RubiksCube.STEP) {
    if (!THREE || !camera) {
      throw new Error('Cube controls have not been initialized.');
    }

    const move = parseMove(token);
    const upperFace = move.face.toUpperCase();
    const directions = getRelativeDirections();

    const isRotation = ['x', 'y', 'z'].includes(move.face);
    const isSlice = ['M', 'E', 'S'].includes(move.face);

    let axis;

    if (isRotation) {
      axis = {
        x: directions.R,
        y: directions.U,
        z: directions.F
      }[move.face].clone();
    } else {
      const axisByFace = {
        R: directions.R,
        L: directions.R,
        U: directions.U,
        D: directions.U,
        F: directions.F,
        B: directions.F,
        M: directions.R,
        E: directions.U,
        S: directions.F
      };

      axis = axisByFace[upperFace].clone();
    }

    if (axis.lengthSq() < 0.99) {
      throw new Error(`Could not resolve an axis for "${token}".`);
    }

    let angle =
      (Math.PI / 2) *
      (move.prime ? -1 : 1) *
      (move.double ? 2 : 1);

    if (isRotation || ['R', 'U', 'F', 'S'].includes(upperFace)) {
      angle *= -1;
    }

    if (isRotation) {
      return { axis, angle, filterFn: () => true };
    }

    if (isSlice) {
      return {
        axis,
        angle,
        filterFn: cubie =>
          Math.abs(cubie.position.dot(axis)) < MOVE_EPSILON
      };
    }

    const positiveSide = ['R', 'U', 'F'].includes(upperFace) ? 1 : -1;

    if (move.wide) {
      return {
        axis,
        angle,
        filterFn: cubie => {
          const projection = cubie.position.dot(axis);
          return positiveSide > 0
            ? projection >= -MOVE_EPSILON
            : projection <= MOVE_EPSILON;
        }
      };
    }

    return {
      axis,
      angle,
      filterFn: cubie =>
        Math.abs(cubie.position.dot(axis) - positiveSide * step) <
        MOVE_EPSILON
    };
  }
  
  // Add these initializations at the end of controls.js
document.addEventListener('DOMContentLoaded', () => {
  // Drawer Toggle Logic
  const toggleBtn = document.getElementById('toggleDrawerBtn');
  const drawer = document.getElementById('moveDrawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('open', isOpen);
    });
  }

  // Tab Switcher Logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${btn.dataset.tab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
});

// Update the recent moves tag display in the bottom bar
function updateRecentMovesUI() {
  const container = document.getElementById('recentMovesList');
  if (!container) return;

  if (!moveHistory || moveHistory.length === 0) {
    container.innerHTML = '<span class="history-empty">None</span>';
    return;
  }

  // Display up to the last 8 moves
  const recent = moveHistory.slice(-8);
  container.innerHTML = recent
    .map(move => `<span class="history-tag">${move}</span>`)
    .join('');

  container.scrollLeft = container.scrollWidth;
}

// Hook into existing move execution recorder
const originalRecordExecutedMove = window.recordExecutedMove;
window.recordExecutedMove = function (token) {
  if (typeof originalRecordExecutedMove === 'function') {
    originalRecordExecutedMove(token);
  }
  updateRecentMovesUI();
};

const originalClearMoveHistory = window.clearMoveHistory;
window.clearMoveHistory = function () {
  if (typeof originalClearMoveHistory === 'function') {
    originalClearMoveHistory();
  }
  updateRecentMovesUI();
};

  window.configureCubeControls = configure;
  window.takeNextMove = takeNextMove;
  window.clearMoveQueue = clearMoveQueue;
  window.getTurnParameters = getTurnParameters;

  window.queueMove = queueMove;
  window.applyAlgorithm = applyAlgorithm;
  window.scrambleCube = scrambleCube;

  window.undoCubeMove = undoCubeMove;
  window.recordExecutedMove = recordExecutedMove;
  window.clearMoveHistory = clearMoveHistory;

  window.resetCube = function () {
    clearMoveQueue();

    if (typeof window.rebuildCube === 'function') {
      window.rebuildCube();
      reportStatus('Cube reset to solved.');
    }
  };
})();