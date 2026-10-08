// filename: hotkeys.js
// Functions/work: Maps keyboard keys and modifier combinations to cube moves.
// What this file does: Handles face turns, slice turns, rotations, and Ctrl+Z undo.
// Connected to: Calls queueMove() and undoCubeMove() from controls.js.

(() => {
  'use strict';

  const FACE_KEYS = {
    r: 'R',
    f: 'F',
    u: 'U',
    d: 'D',
    j: 'L',
    h: 'B'
  };

  const SLICE_KEYS = {
    m: 'M',
    e: 'E',
    s: 'S'
  };

  const ROTATION_KEYS = {
    c: 'x',
    v: 'y',
    b: 'z'
  };

  function isTypingTarget(target) {
    return (
      target instanceof Element &&
      (target.isContentEditable ||
        target.closest('input, textarea, select'))
    );
  }

  function handleKeyDown(event) {
    if (event.repeat || event.isComposing || isTypingTarget(event.target)) {
      return;
    }

    const key = event.key.toLowerCase();

    // Leave Ctrl+Shift+Z available for the browser's redo behavior.
    if (event.ctrlKey && !event.altKey && !event.shiftKey && key === 'z') {
      event.preventDefault();
      window.undoCubeMove?.();
      return;
    }

    const face = FACE_KEYS[key];
    const slice = SLICE_KEYS[key];
    const rotation = ROTATION_KEYS[key];

    if (!face && !slice && !rotation) return;

    // Ctrl creates wide moves for face keys only.
    if ((slice || rotation) && event.ctrlKey) return;

    let move = face
      ? (event.ctrlKey ? face.toLowerCase() : face)
      : (slice || rotation);

    if (event.altKey) {
      move += '2';
    } else if (event.shiftKey) {
      move += "'";
    }

    event.preventDefault();
    window.queueMove?.(move);
  }

  window.addEventListener('keydown', handleKeyDown);
})();