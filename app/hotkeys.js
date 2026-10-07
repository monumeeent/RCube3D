// filename: hotkeys.js
// Functions/work: Maps keyboard keys and modifiers to cube moves.
// What this file does: Queues face turns, slice moves, cube rotations, and undo.
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

    if (event.ctrlKey && !event.altKey && key === 'z') {
      event.preventDefault();
      window.undoCubeMove?.();
      return;
    }

    const face = FACE_KEYS[key];
    const slice = SLICE_KEYS[key];
    const rotation = ROTATION_KEYS[key];

    if (!face && !slice && !rotation) return;

    // Ctrl makes face moves wide. It is not used for slice moves or rotations.
    if ((slice || rotation) && event.ctrlKey) return;

    let move;

    if (face) {
      move = event.ctrlKey ? face.toLowerCase() : face;
    } else {
      move = slice || rotation;
    }

    // Alt takes precedence over Shift if both are pressed.
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