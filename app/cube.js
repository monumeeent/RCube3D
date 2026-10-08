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
  const TURN_DURATION_MS = 200;

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

      const progress = Math.min((now - startTime) / TURN_DURATION_MS, 1);

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

  window.RubiksCube = {
    STEP,
    init,
    executeMove,
    rebuildCube,
    get isAnimating() {
      return isAnimating;
    }
  };
})();