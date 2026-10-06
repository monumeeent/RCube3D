// Color palette mapping
const COLORS = {
  R: 0xb90000,
  L: 0xff5900,
  U: 0xffd500, // Top face (+Y) = Yellow
  D: 0xffffff, // Bottom face (-Y) = White
  B: 0x009b48,
  F: 0x0045ad,
  INNER: 0x111111
};

let scene, camera, renderer, controls;
let cubies = [];
let isAnimating = false;

const CUBE_SIZE = 0.75;
const GAP = 0.1;
const STEP = CUBE_SIZE + GAP;

function init() {
  const container = document.getElementById('canvas-container');

  // Scene
  scene = new THREE.Scene();
  scene.rotation.z = 0;

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 5, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Orbit Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.update();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight1.position.set(10, 20, 15);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight2.position.set(-10, -20, -15);
  scene.add(dirLight2);

  buildCube();
  animate();
}

function buildCube() {
  cubies.forEach(c => scene.remove(c));
  cubies = [];

  const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const materials = [
          new THREE.MeshStandardMaterial({ color: x === 1 ? COLORS.R : COLORS.INNER, roughness: 0.3 }),
          new THREE.MeshStandardMaterial({ color: x === -1 ? COLORS.L : COLORS.INNER, roughness: 0.3 }),
          new THREE.MeshStandardMaterial({ color: y === 1 ? COLORS.U : COLORS.INNER, roughness: 0.3 }),
          new THREE.MeshStandardMaterial({ color: y === -1 ? COLORS.D : COLORS.INNER, roughness: 0.3 }),
          new THREE.MeshStandardMaterial({ color: z === 1 ? COLORS.F : COLORS.INNER, roughness: 0.3 }),
          new THREE.MeshStandardMaterial({ color: z === -1 ? COLORS.B : COLORS.INNER, roughness: 0.3 })
        ];

        const cubie = new THREE.Mesh(geometry, materials);
        cubie.position.set(x * STEP, y * STEP, z * STEP);
        scene.add(cubie);
        cubies.push(cubie);
      }
    }
  }
}

window.rebuildCube = function() {
  isAnimating = false;
  buildCube();
};

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  processQueue();
  renderer.render(scene, camera);
}

function processQueue() {
  if (isAnimating || window.moveQueue.length === 0) return;
  const move = window.moveQueue.shift();
  executeMove(move);
}

/**
 * Maps view-relative move directions ('F', 'R', 'U', etc.) to world-space vectors
 * based on camera position and cube orientation.
 */
function getRelativeDirections() {
  const frontVec = new THREE.Vector3();
  const rightVec = new THREE.Vector3();
  const upVec = new THREE.Vector3(0, 1, 0);

  // Get camera viewing vector (world space)
  camera.getWorldDirection(frontVec);
  frontVec.negate(); // Point from origin toward camera

  // Compute camera right vector
  rightVec.crossVectors(upVec, frontVec).normalize();

  // Find dominant primary axes for relative Front and Right
  const R = getClosestWorldAxis(rightVec);
  const F = getClosestWorldAxis(frontVec);
  const U = new THREE.Vector3(0, 1, 0);

  return { R, F, U };
}

/**
 * Snaps a 3D direction vector to the nearest primary axis (X, Y, or Z).
 */
function getClosestWorldAxis(vec) {
  const absX = Math.abs(vec.x);
  const absY = Math.abs(vec.y);
  const absZ = Math.abs(vec.z);

  if (absX > absY && absX > absZ) {
    return new THREE.Vector3(Math.sign(vec.x), 0, 0);
  } else if (absY > absX && absY > absZ) {
    return new THREE.Vector3(0, Math.sign(vec.y), 0);
  } else {
    return new THREE.Vector3(0, 0, Math.sign(vec.z));
  }
}

/**
 * Resolves move parameters (axis, angle, filterFn) with support for View-Relative Moves.
 */

function executeMove(move) {
  isAnimating = true;

  const { axis, angle, filterFn } = window.getTurnParameters(move, STEP);
  const sliceCubies = cubies.filter(filterFn);

  const pivot = new THREE.Group();
  scene.add(pivot);
  sliceCubies.forEach(c => pivot.attach(c));

  const duration = 200;
  const startTime = performance.now();

  function animateRotation(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    pivot.setRotationFromAxisAngle(axis, angle * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animateRotation);
    } else {
      pivot.setRotationFromAxisAngle(axis, angle);
      pivot.updateMatrixWorld();

      sliceCubies.forEach(c => {
        scene.attach(c);
        c.position.x = Math.round(c.position.x / STEP) * STEP;
        c.position.y = Math.round(c.position.y / STEP) * STEP;
        c.position.z = Math.round(c.position.z / STEP) * STEP;
      });

      scene.remove(pivot);
      isAnimating = false;
    }
  }

  requestAnimationFrame(animateRotation);
}

window.onload = init;