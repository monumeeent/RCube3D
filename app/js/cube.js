(() => {
  'use strict';

  const COLORS = {
    R: 0xb90000,
    L: 0xff5900,
    U: 0xffd500,
    D: 0xffffff,
    B: 0x009b48,
    F: 0x0045ad,
    INNER: 0x111111
  };

  const CUBE_SIZE = 0.45;
  const GAP = 0.05;
  const STEP = CUBE_SIZE + GAP;
  let turnDurationMs = 200;

  let THREE = null;
  let scene = null;
  let cubies = [];
  let cubeGeometry = null;
  let cubeMaterials = new Map();

  let isAnimating = false;
  let activeTurnFrame = 0;
  let activePivot = null;
  let cubeGeneration = 0;

  function disposeCube() {
    for (const cubie of cubies) {
      cubie.parent?.remove(cubie);
    }

    if (cubeGeometry) {
      cubeGeometry.dispose();
      cubeGeometry = null;
    }

    for (const material of cubeMaterials.values()) {
      material.dispose();
    }

    cubeMaterials.clear();
    cubies = [];
  }

  function getMaterial(color) {
    if (!cubeMaterials.has(color)) {
      cubeMaterials.set(
        color,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.3
        })
      );
    }

    return cubeMaterials.get(color);
  }

  function buildCube() {
    disposeCube();

    cubeGeometry = new THREE.BoxGeometry(
      CUBE_SIZE,
      CUBE_SIZE,
      CUBE_SIZE
    );

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const materials = [
            getMaterial(x === 1 ? COLORS.R : COLORS.INNER),
            getMaterial(x === -1 ? COLORS.L : COLORS.INNER),
            getMaterial(y === 1 ? COLORS.U : COLORS.INNER),
            getMaterial(y === -1 ? COLORS.D : COLORS.INNER),
            getMaterial(z === 1 ? COLORS.F : COLORS.INNER),
            getMaterial(z === -1 ? COLORS.B : COLORS.INNER)
          ];

          const cubie = new THREE.Mesh(cubeGeometry, materials);
          cubie.position.set(x * STEP, y * STEP, z * STEP);
          scene.add(cubie);
          cubies.push(cubie);
        }
      }
    }
  }

  function init(three, cubeScene) {
    THREE = three;
    scene = cubeScene;
    buildCube();
  }

  function executeMove(token, getTurnParameters) {
    const { axis, angle, filterFn } = getTurnParameters(token, STEP);
    const sliceCubies = cubies.filter(filterFn);

    if (!sliceCubies.length) {
      throw new Error(`Move "${token}" did not select any cubies.`);
    }

    const generation = cubeGeneration;
    const pivot = new THREE.Group();

    activePivot = pivot;
    scene.add(pivot);
    sliceCubies.forEach(cubie => pivot.attach(cubie));

    isAnimating = true;
    const startTime = performance.now();

    function animateTurn(now) {
      if (generation !== cubeGeneration) return;

      const progress = Math.min((now - startTime) / turnDurationMs, 1);

      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      pivot.setRotationFromAxisAngle(axis, angle * easedProgress);

      if (progress < 1) {
        activeTurnFrame = requestAnimationFrame(animateTurn);
        return;
      }

      pivot.setRotationFromAxisAngle(axis, angle);
      pivot.updateMatrixWorld(true);

      for (const cubie of sliceCubies) {
        scene.attach(cubie);
        cubie.position.x = Math.round(cubie.position.x / STEP) * STEP;
        cubie.position.y = Math.round(cubie.position.y / STEP) * STEP;
        cubie.position.z = Math.round(cubie.position.z / STEP) * STEP;
      }

      scene.remove(pivot);
      activePivot = null;
      activeTurnFrame = 0;
      isAnimating = false;
    }

    activeTurnFrame = requestAnimationFrame(animateTurn);
  }

  function rebuildCube() {
    cubeGeneration++;

    if (activeTurnFrame) {
      cancelAnimationFrame(activeTurnFrame);
    }

    activeTurnFrame = 0;

    if (activePivot) {
      activePivot.parent?.remove(activePivot);
    }

    activePivot = null;
    isAnimating = false;
    buildCube();
  }

  function setTurnDuration(ms) {
    turnDurationMs = Math.max(20, Math.min(1000, Number(ms) || 200));
  }

  // Orientation-independent solved check: every world direction must show
  // a single sticker color across its nine facelets.
  function isSolved() {
    if (!THREE || !cubies.length) return false;
    const dirs = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
    ];
    const locals = dirs;
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const n = new THREE.Vector3();
    const seen = dirs.map(() => new Set());

    for (const cubie of cubies) {
      cubie.getWorldPosition(pos);
      cubie.getWorldQuaternion(quat);
      dirs.forEach((dir, d) => {
        if (Math.abs(pos.dot(dir) - STEP) > 0.1) return;
        for (let i = 0; i < 6; i++) {
          n.copy(locals[i]).applyQuaternion(quat);
          if (n.dot(dir) > 0.9) {
            seen[d].add(cubie.material[i].color.getHex());
            break;
          }
        }
      });
    }
    return seen.every(set => set.size === 1);
  }

  // ── X-ray / look-ahead mode (Task 1.5) ─────────────────────────────────
  // In x-ray mode every cubie becomes semi-transparent so hidden faces can
  // be seen through the visible ones for look-ahead during algorithm review.
  let xrayEnabled = false;

  function setXrayMode(enabled) {
    xrayEnabled = !!enabled;
    for (const mat of cubeMaterials.values()) {
      mat.transparent = xrayEnabled;
      mat.opacity = xrayEnabled ? 0.38 : 1.0;
      mat.depthWrite = !xrayEnabled;
      mat.needsUpdate = true;
    }
  }

  function toggleXrayMode() {
    setXrayMode(!xrayEnabled);
    return xrayEnabled;
  }

  window.setXrayMode = setXrayMode;
  window.toggleXrayMode = toggleXrayMode;
  
  
  
  function getStateSnapshot() {
  if (isAnimating) {
    throw new Error('Cannot snapshot the cube during an animation.');
  }

  scene.updateMatrixWorld(true);

  const localNormals = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
  ];

  const faceName = normal => {
    const x = Math.round(normal.x);
    const y = Math.round(normal.y);
    const z = Math.round(normal.z);

    if (x === 1) return 'R';
    if (x === -1) return 'L';
    if (y === 1) return 'U';
    if (y === -1) return 'D';
    if (z === 1) return 'F';
    if (z === -1) return 'B';
    return '?';
  };

  return cubies.map(cubie => {
    const position = cubie.getWorldPosition(new THREE.Vector3());
    const quaternion = cubie.getWorldQuaternion(new THREE.Quaternion());

    const gridPosition = [
      Math.round(position.x / STEP),
      Math.round(position.y / STEP),
      Math.round(position.z / STEP)
    ].join(',');

    const stickers = [];

    cubie.material.forEach((material, index) => {
      if (material.color.getHex() === COLORS.INNER) return;

      const normal = localNormals[index]
        .clone()
        .applyQuaternion(quaternion);

      stickers.push(`${faceName(normal)}:${material.color.getHexString()}`);
    });

    stickers.sort();
    return `${gridPosition}|${stickers.join(',')}`;
  }).sort().join(';');
}
  

  window.RubiksCube = {
    STEP,
    setTurnDuration,
    isSolved,
    init,
	getStateSnapshot,
    executeMove,
    rebuildCube,
    get isAnimating() {
      return isAnimating;
    }
  };
})();