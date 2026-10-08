// filename: controls.js
// Functions/work: Parses moves, manages the queue and undo history, and handles control-bar UI.
// What this file does: Provides move controls, algorithm input, scramble, undo, recent history, and copy.
// Connected to: Uses RubiksCube from cube.js; called by main.js and hotkeys.js.

(() => {
  'use strict';

  const MAX_ALGORITHM_LENGTH = 2000;
  const MAX_PENDING_MOVES = 500;
  const MAX_HISTORY = 1000;
  const MOVE_EPSILON = 0.1;

  const MOVE_TOKEN =
    /^(Rw|Lw|Uw|Dw|Fw|Bw|[RLUDFBrludfbMESxyz])(2|')?$/;

  let queueHead = 0;
  let THREE = null;
  let camera = null;
  let lastFrontAxis = null;
  let moveHistory = [];
  let pendingUndoMoves = 0;
  let scrambleHistory = [];

  window.moveQueue = [];

  function reportStatus(message, isError = false) {
    if (typeof window.reportCubeStatus === 'function') {
      window.reportCubeStatus(message, isError);
    } else {
      console[isError ? 'error' : 'info'](message);
    }
  }

  function parseMove(token) {
    if (typeof token !== 'string') {
      throw new Error('Move must be text.');
    }

    const match = MOVE_TOKEN.exec(token);
    if (!match) {
      throw new Error(`Invalid move: "${token}"`);
    }

    return { token };
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

function enqueueMoves(tokens, kind = 'solving') {
  const pending = window.moveQueue.length - queueHead;

  if (pending + tokens.length > MAX_PENDING_MOVES) {
    throw new Error(
      `The move queue is limited to ${MAX_PENDING_MOVES} moves.`
    );
  }

  compactQueueIfNeeded();
  window.moveQueue.push(...tokens.map(token => ({ token, kind })));
  renderRecentMoves();
}

function enqueueUndoMove(token) {
  const pending = window.moveQueue.length - queueHead;

  if (pending + 1 > MAX_PENDING_MOVES) {
    throw new Error(
      `The move queue is limited to ${MAX_PENDING_MOVES} moves.`
    );
  }

  compactQueueIfNeeded();

  const insertAt = queueHead + pendingUndoMoves;
  window.moveQueue.splice(insertAt, 0, {
    token,
    kind: 'solving'
  });
  pendingUndoMoves++;
  renderRecentMoves();
}

function takeNextMove() {
  if (queueHead >= window.moveQueue.length) {
    window.moveQueue.length = 0;
    queueHead = 0;
    renderRecentMoves();
    return null;
  }

  const move = window.moveQueue[queueHead++];
  renderRecentMoves();
  return move;
}

function clearMoveQueue() {
  window.moveQueue.length = 0;
  queueHead = 0;
  pendingUndoMoves = 0;
  renderRecentMoves();
}
  function renderMoveTags(containerId, moves, isQueued = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.replaceChildren();

  if (moves.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'history-empty';
    empty.textContent = 'None';
    container.appendChild(empty);
    return;
  }

  for (const move of moves.slice(-100)) {
    const tag = document.createElement('span');
    tag.className = isQueued
      ? 'history-tag queued-tag'
      : 'history-tag';
    tag.textContent = move;
    container.appendChild(tag);
  }
}

// controls.js -> inside renderRecentMoves()
function renderRecentMoves() {
  const pendingMoves = window.moveQueue
    .slice(queueHead)
    .filter(Boolean);

  const queuedScrambles = pendingMoves
    .filter(move => move.kind === 'scramble')
    .map(move => move.token);

  const queuedSolvingMoves = pendingMoves
    .filter(move => move.kind !== 'scramble')
    .map(move => move.token);

  renderMoveTags('scrambleQueueList', queuedScrambles, true);
  renderMoveTags('scrambleMovesList', scrambleHistory);
  renderMoveTags('solvingQueueList', queuedSolvingMoves, true);
  renderMoveTags('recentMovesList', moveHistory);

  // Update the bottom-right moves bar text (newest moves on the left)
  const displayEl = document.getElementById('solvingMovesDisplay');
  if (displayEl) {
    if (moveHistory.length > 0) {
      // Reverses history array so the most recent move appears on the far left
      displayEl.textContent = [...moveHistory].reverse().join(' ');
      
      // Keeps the horizontal scroll locked to the far left (showing the latest move)
      displayEl.scrollLeft = 0;
    } else {
      displayEl.textContent = '--';
    }
  }
}

function recordExecutedMove(token, kind = 'solving') {
  if (pendingUndoMoves > 0) {
    pendingUndoMoves--;
    renderRecentMoves();
    return;
  }

  const history = kind === 'scramble' ? scrambleHistory : moveHistory;
  history.push(token);

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  renderRecentMoves();
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
      renderRecentMoves();
      reportStatus(`Undo queued for ${previousMove}.`);
    } catch (error) {
      moveHistory.push(previousMove);
      renderRecentMoves();
      reportStatus(error.message, true);
    }
  }

  function clearMoveHistory() {
  moveHistory = [];
  scrambleHistory = [];
  pendingUndoMoves = 0;
  renderRecentMoves();
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
      // Validate the complete algorithm before adding any moves to the queue.
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
      const modifier =
        modifiers[Math.floor(Math.random() * modifiers.length)];

      moves.push(face + modifier);
    }

    try {
      enqueueMoves(moves, 'scramble');
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

    const match = MOVE_TOKEN.exec(token);
    if (!match) {
      throw new Error(`Invalid move: "${token}"`);
    }

    const symbol = match[1];
    const modifier = match[2] || '';
    const isWide = symbol.endsWith('w') || /^[rludfb]$/.test(symbol);
    const face = symbol.endsWith('w') ? symbol[0].toLowerCase() : symbol;
    const upperFace = face.toUpperCase();

    const directions = getRelativeDirections();
    const isRotation = ['x', 'y', 'z'].includes(face);
    const isSlice = ['M', 'E', 'S'].includes(face);

    let axis;

    if (isRotation) {
      axis = {
        x: directions.R,
        y: directions.U,
        z: directions.F
      }[face].clone();
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

    const prime = modifier === "'";
    const double = modifier === '2';

    let angle =
      (Math.PI / 2) *
      (prime ? -1 : 1) *
      (double ? 2 : 1);

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

    if (isWide) {
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

  async function copyMoveHistory() {
    if (moveHistory.length === 0) {
      reportStatus('There are no moves to copy.');
      return;
    }

    const text = moveHistory.join(' ');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand('copy');
        textarea.remove();

        if (!copied) {
          throw new Error('Clipboard copy was not available.');
        }
      }

      reportStatus('Move history copied.');
    } catch (error) {
      reportStatus('Could not copy move history.', true);
    }
  }

  function resizeAlgorithmInput() {
    const input = document.getElementById('alg-input');
    if (!input) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const style = getComputedStyle(input);
    context.font = style.font;

    const text = input.value || input.placeholder || '';
    const measuredWidth = context.measureText(text).width + 48;
    const maxWidth = Math.max(
  110,
  Math.min(270, Math.floor(window.innerWidth * 0.38))
);

    input.style.width =
      `${Math.min(maxWidth, Math.max(120, measuredWidth))}px`;
  }

  function initializeControlsUI() {
    const toggleBtn = document.getElementById('toggleDrawerBtn');
    const drawer = document.getElementById('moveDrawer');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        toggleBtn.classList.toggle('open', isOpen);
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(item => item.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        button.classList.add('active');

        const panel = document.getElementById(
          `tab-${button.dataset.tab}`
        );

        if (panel) {
          panel.classList.add('active');
        }
      });
    });

    const input = document.getElementById('alg-input');
    input?.addEventListener('input', resizeAlgorithmInput);
    window.addEventListener('resize', resizeAlgorithmInput);
    resizeAlgorithmInput();

    document
      .getElementById('copyMovesBtn')
      ?.addEventListener('click', copyMoveHistory);

    renderRecentMoves();
  }

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeControlsUI, {
      once: true
    });
  } else {
    initializeControlsUI();
  }
})();