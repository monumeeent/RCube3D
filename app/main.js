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
    front: [0, 0.3, 5.8]
  };
  let cameraTween = null;

  function setCameraView(name) {
    const target = CAMERA_VIEWS[name];
    if (!target || !camera || !controls) return;
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