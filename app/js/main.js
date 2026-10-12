(() => {
  'use strict';

  let scene = null;
  let camera = null;
  let renderer = null;
  let controls = null;
  let container = null;
  let statusElement = null;
  let initialized = false;

  function reportStatus(message, isError = false) {
    if (!statusElement) {
      console[isError ? 'error' : 'info'](message);
      return;
    }

    statusElement.textContent = message;
    statusElement.dataset.error = isError ? 'true' : 'false';
  }

  function ensureStatusElement() {
    statusElement = document.getElementById('app-status');
    if (statusElement) return;

    statusElement = document.createElement('p');
    statusElement.id = 'app-status';
    statusElement.setAttribute('role', 'status');
    statusElement.setAttribute('aria-live', 'polite');

    const layout = document.querySelector('.main-layout');
    (layout || document.body).appendChild(statusElement);
  }

  function detachInteractiveViewerFromLink() {
    if (!container) return;

    const anchor = container.closest('a');
    if (!anchor) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'cube-viewer';

    while (anchor.firstChild) {
      wrapper.appendChild(anchor.firstChild);
    }

    anchor.replaceWith(wrapper);
  }

  function resizeRenderer() {
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height, true);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function processQueue() {
    if (window.RubiksCube.isAnimating) return;

    const queuedMove = window.takeNextMove();
    if (queuedMove === null) return;

    // Support both the new { token, kind } queue entries and plain move strings.
    const token =
      typeof queuedMove === 'string' ? queuedMove : queuedMove.token;
    const kind =
      typeof queuedMove === 'string' ? 'solving' : queuedMove.kind;

    try {
      window.RubiksCube.executeMove(token, window.getTurnParameters);
      window.recordExecutedMove(token, kind, queuedMove.tag || null);
    } catch (error) {
      console.error('Move failed:', error);
      window.clearMoveQueue();
      window.rebuildCube();
      reportStatus(`Move failed; cube reset. ${error.message}`, true);
    }
  }

const CAMERA_VIEWS = {
    reset: [0, 3.7, 4.5],
    iso: [3.3, 3.2, 3.5],
    top: [0, 6, 0.3],
    front: [0, 0.3, 5.8],
    // Slot 4: low 3/4 side view — shows Front + Right + a sliver of top.
    // Distinct from iso (more side-on) and front (fully flat).
    side: [4.8, 1.4, 3.2]
  };
  let cameraTween = null;

  function setCameraView(name) {
    let target = CAMERA_VIEWS[name];
    if (!target || !camera || !controls) return;

    const currentDir = camera.position.clone().normalize();
    const distance = camera.position.length();

    if (name === 'iso') {
      target = [
        currentDir.x >= 0 ? 3.3 : -3.3,
        3.2,
        currentDir.z >= 0 ? 3.5 : -3.5
      ];
    } else if (name === 'front') {
      if (Math.abs(currentDir.x) > Math.abs(currentDir.z)) {
        target = [Math.sign(currentDir.x) * distance, 0.3, 0];
      } else {
        target = [0, 0.3, Math.sign(currentDir.z) * distance];
      }
    } else if (name === 'side') {
      const xSign = currentDir.x >= 0 ? 1 : -1;
      const zSign = currentDir.z >= 0 ? 1 : -1;
      target = [xSign * 4.8, 1.4, zSign * 3.2];
    } else if (name === 'top') {
      // Keep top-down high on the Y-axis, but slightly bias it toward your current 
      // quadrant's X/Z offset so it doesn't flip orientation abruptly.
      target = [
        currentDir.x * 0.5, 
        6, 
        currentDir.z * 0.5
      ];
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const end = new THREE.Vector3(...target);
    if (reduce) {
      camera.position.copy(end);
      controls.target.set(0, 0, 0);
      controls.update();
      return;
    }
    cameraTween = {
      start: camera.position.clone(),
      end,
      t0: performance.now(),
      duration: 650
    };
  }
  
  
  
  // Returns the name of the face whose outward normal is most aligned with the
  // current camera direction (i.e. the face the camera is "looking at").
  const FACE_NORMALS = {
    front: [0, 0, 1], back: [0, 0, -1],
    right: [1, 0, 0], left: [-1, 0, 0],
    top: [0, 1, 0], bottom: [0, -1, 0]
  };
  function getClosestFace() {
    if (!camera) return 'front';
    const dir = camera.position.clone().normalize();
    let best = 'front', bestDot = -Infinity;
    for (const [face, n] of Object.entries(FACE_NORMALS)) {
      const dot = dir.x * n[0] + dir.y * n[1] + dir.z * n[2];
      if (dot > bestDot) { bestDot = dot; best = face; }
    }
    return best;
  }

  // Snap camera to the preset closest to the current viewpoint.
  function snapCameraToClosestFace() {
    if (!camera) return;
    const dir = camera.position.clone().normalize();
    let bestView = 'iso', bestDot = -Infinity;
    for (const [name, pos] of Object.entries(CAMERA_VIEWS)) {
      if (name === 'reset') continue;
      const v = new THREE.Vector3(...pos).normalize();
      const dot = dir.dot(v);
      if (dot > bestDot) { bestDot = dot; bestView = name; }
    }
    setCameraView(bestView);
    return bestView;
  }

  window.getClosestFace = getClosestFace;
  window.snapCameraToClosestFace = snapCameraToClosestFace;

  function stepCameraTween(now) {
    if (!cameraTween) return;
    const p = Math.min((now - cameraTween.t0) / cameraTween.duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    camera.position.lerpVectors(cameraTween.start, cameraTween.end, eased);
    controls.target.lerp(new THREE.Vector3(0, 0, 0), eased);
    if (p >= 1) cameraTween = null;
  }

  window.setCameraView = setCameraView;

  function animate(now) {
    requestAnimationFrame(animate);

    if (!initialized || !renderer || !scene || !camera || !controls) {
      return;
    }

    stepCameraTween(now || performance.now());
    controls.update();
    processQueue();
    renderer.render(scene, camera);
  }

  function init() {
    container = document.getElementById('canvas-container');

    if (!container) {
      throw new Error('The #canvas-container element was not found.');
    }

    if (!window.THREE || !THREE.OrbitControls) {
      throw new Error('Three.js or OrbitControls did not load.');
    }

    detachInteractiveViewerFromLink();
    ensureStatusElement();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 3.7, 4.5);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();
    controls.addEventListener('start', () => { cameraTween = null; });

    window.configureCubeControls(THREE, camera);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(10, 20, 15);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-10, -20, -15);
    scene.add(fillLight);

    window.RubiksCube.init(THREE, scene);

    window.rebuildCube = () => {
      window.clearMoveHistory();
      window.RubiksCube.rebuildCube();
    };

    resizeRenderer();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', resizeRenderer);
    }

    initialized = true;
    requestAnimationFrame(animate);
    reportStatus('Cube ready.');
  }

  function startApp() {
    if (initialized) return;

    try {
      init();
    } catch (error) {
      console.error('Cube initialization failed:', error);
      ensureStatusElement();
      reportStatus(
        `The 3D viewer could not be initialized: ${error.message}`,
        true
      );
    }
  }

  window.reportCubeStatus = reportStatus;

  if (document.getElementById('canvas-container')) {
    startApp();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, { once: true });
  } else {
    startApp();
  }
})();