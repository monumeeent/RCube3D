// Queue and state management
window.moveQueue = [];

window.queueMove = function(move) {
  window.moveQueue.push(move);
};

window.applyAlgorithm = function() {
  const input = document.getElementById('alg-input');
  if (!input) return;
  const raw = input.value;
  const clean = raw.replace(/[\u2018\u2019]/g, "'").trim();
  const tokens = clean.split(/\s+/);
  tokens.forEach(t => {
    if (t) window.moveQueue.push(t);
  });
};

window.scrambleCube = function() {
  const moves = ['R', 'L', 'U', 'D', 'F', 'B', 'M', 'E', 'S'];
  const mods = ['', "'", '2'];
  for (let i = 0; i < 20; i++) {
    const m = moves[Math.floor(Math.random() * moves.length)];
    const mod = mods[Math.floor(Math.random() * mods.length)];
    window.moveQueue.push(m + mod);
  }
};

window.resetCube = function() {
  window.moveQueue.length = 0;
  if (typeof window.rebuildCube === 'function') {
    window.rebuildCube();
  }
};

/**
 * Resolves move parameters (axis, cubie filter condition, angle).
 * Supports Outer Faces (R, L, U, D, F, B), Slices (M, E, S), and Cube Rotations (x, y, z).
 */
// Add wide move handling in getTurnParameters inside controls.js
window.getTurnParameters = function(move, STEP) {
  const rawFace = move.replace("w", "");
  const face = rawFace[0];
  const isUpper = face === face.toUpperCase();
  const isSlice = ['M', 'E', 'S'].includes(face);
  const isRotation = ['x', 'y', 'z'].includes(face);
  const isWide = !isUpper && !isSlice && !isRotation;
  
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");

  const relativeDirs = getRelativeDirections();

  // Map faces and slice directions to relative reference axes
  const faceAxisMap = {
    R: relativeDirs.R, L: relativeDirs.R,
    U: relativeDirs.U, D: relativeDirs.U,
    F: relativeDirs.F, B: relativeDirs.F,
    M: relativeDirs.R, E: relativeDirs.U, S: relativeDirs.F
  };

  const faceUpper = face.toUpperCase();
  const axis = (faceAxisMap[faceUpper] || relativeDirs.R).clone();

  // Base rotation angle
  let angle = (Math.PI / 2) * (isPrime ? -1 : 1) * (isDouble ? 2 : 1);

  // Angle adjustments for standard face and slice directions
  if (['R', 'U', 'F', 'S'].includes(faceUpper)) {
    angle *= -1;
  }

  // Handle Full Cube Rotations (x, y, z)
  if (isRotation) {
    const rotAxisMap = { x: relativeDirs.R, y: relativeDirs.U, z: relativeDirs.F };
    const rotAxis = (rotAxisMap[face] || relativeDirs.R).clone();
    if (face === 'x' || face === 'y' || face === 'z') angle *= -1;
    return { axis: rotAxis, angle, filterFn: () => true };
  }

  // Handle Slice Moves (M, E, S)
  if (isSlice) {
    const filterFn = c => Math.abs(c.position.dot(axis)) < 0.1;
    return { axis, angle, filterFn };
  }

  // Handle Outer Face and Wide Moves
  const side = ['R', 'U', 'F'].includes(faceUpper) ? 1 : -1;
  let filterFn;

  if (isWide) {
    filterFn = c => {
      const dot = c.position.dot(axis);
      return side > 0 ? dot >= -0.1 : dot <= 0.1;
    };
  } else {
    filterFn = c => {
      const dot = c.position.dot(axis);
      return Math.abs(dot - (side * STEP)) < 0.1;
    };
  }

  return { axis, angle, filterFn };
};


