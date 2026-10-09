// filename: ui.js
// Functions/work: Panel behavior for RCube3D. Move pad keycaps, keybind lighting,
//   timer + TPS, move queue with scrubbing, algorithm library, camera presets,
//   mobile speed dial.
// Connected to: controls.js (queueMove, enqueueCubeMoves, events), cube.js
//   (RubiksCube.isSolved / setTurnDuration), main.js (setCameraView).

(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const status = (msg, isError = false) => window.reportCubeStatus?.(msg, isError);
  const isTyping = t => t instanceof Element && (t.isContentEditable || t.closest('input, textarea, select'));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } }
  };

  /* ==========================================================
     0. Layout: collapsible sections, collapsible sidebar, cube focus
     ========================================================== */
  const prefs = (() => { try { return JSON.parse(store.get('rcube3d.ui')) || {}; } catch { return {}; } })();
  const savePrefs = () => store.set('rcube3d.ui', JSON.stringify(prefs));
  prefs.collapsed = prefs.collapsed || (prefs.collapsed === undefined ? ['history'] : []);
  if (!Array.isArray(prefs.collapsed)) prefs.collapsed = ['history'];

  const cubeCanvas = () => $('canvas-container').querySelector('canvas');
  function focusCube() {
    const c = cubeCanvas();
    if (c) c.focus({ preventScroll: true });
  }
  (() => {
    const c = cubeCanvas();
    if (!c) return;
    c.tabIndex = 0;
    c.setAttribute('aria-label', "Rubik's cube. Focus here to use keyboard moves.");
    focusCube();
  })();

  function setModule(mod, open) {
    mod.classList.toggle('is-collapsed', !open);
    const btn = mod.querySelector('.collapse-btn');
    const title = mod.querySelector('h2').textContent;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} ${title}`);
    const body = mod.querySelector('.module-body');
    if (open) body.removeAttribute('inert'); else body.setAttribute('inert', '');
  }

  document.querySelectorAll('.module').forEach(mod => {
    const head = mod.querySelector('.module-head');
    const body = document.createElement('div');
    const inner = document.createElement('div');
    const pad = document.createElement('div');
    body.className = 'module-body';
    body.id = `${mod.id}-body`;
    inner.className = 'module-inner';
    pad.className = 'module-pad';
    [...mod.children].forEach(child => { if (child !== head) pad.append(child); });
    inner.append(pad);
    body.append(inner);
    mod.append(body);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'collapse-btn';
    btn.setAttribute('aria-controls', body.id);
    btn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-chev-d"/></svg>';
    head.append(btn);
    setModule(mod, !prefs.collapsed.includes(mod.id));

    head.addEventListener('click', e => {
      if (e.target.closest('button:not(.collapse-btn), label, input, .seg')) return;
      const open = mod.classList.contains('is-collapsed');
      setModule(mod, open);
      prefs.collapsed = [...document.querySelectorAll('.module.is-collapsed')].map(m => m.id);
      savePrefs();
    });
  });

  const app = document.querySelector('.app');
  const panelEl = $('panel');
  const panelBtn = $('panelToggle');
  function setPanel(open) {
    app.classList.toggle('panel-collapsed', !open);
    panelBtn.setAttribute('aria-expanded', String(open));
    panelBtn.setAttribute('aria-label', open ? 'Collapse sidebar' : 'Expand sidebar');
    panelBtn.title = open ? 'Hide controls ( \\ )' : 'Show controls ( \\ )';
    if (open) panelEl.removeAttribute('inert');
    else { panelEl.setAttribute('inert', ''); focusCube(); }
    prefs.panel = open;
    savePrefs();
  }
  panelBtn.addEventListener('click', () => setPanel(app.classList.contains('panel-collapsed')));
  if (prefs.panel === false) setPanel(false);

  // After a mouse or touch interaction, hand focus back to the cube so hotkeys apply.
  // Keyboard activation (detail 0) is left alone so keyboard users keep their place.
  document.addEventListener('click', e => {
    if (e.detail === 0) return;
    if (e.target.closest('button, label, .module-head, input[type="range"], input[type="checkbox"]')) focusCube();
  });
  $('alg-input').addEventListener('keydown', e => {
    if (e.key === 'Escape') { $('alg-input').blur(); focusCube(); }
  });

  /* ==========================================================
     1. Move pad: keycaps grouped by move type
     ========================================================== */
  const CATS = {
    outer: [
      { base: 'R', key: 'R', f: 'R' }, { base: 'L', key: 'J', f: 'L' }, { base: 'U', key: 'U', f: 'U' },
      { base: 'D', key: 'D', f: 'D' }, { base: 'F', key: 'F', f: 'F' }, { base: 'B', key: 'H', f: 'B' }
    ],
    slice: [
      { base: 'M', key: 'M', split: ['var(--face-r)', 'var(--face-l)'] },
      { base: 'E', key: 'E', split: ['var(--face-u)', 'var(--face-d)'] },
      { base: 'S', key: 'S', split: ['var(--face-f)', 'var(--face-b)'] }
    ],
    wide: [
      { base: 'r', key: 'R', f: 'R', ctrl: true }, { base: 'l', key: 'J', f: 'L', ctrl: true }, { base: 'u', key: 'U', f: 'U', ctrl: true },
      { base: 'd', key: 'D', f: 'D', ctrl: true }, { base: 'f', key: 'F', f: 'F', ctrl: true }, { base: 'b', key: 'H', f: 'B', ctrl: true }
    ],
    rotation: [
      { base: 'x', key: 'C' }, { base: 'y', key: 'V' }, { base: 'z', key: 'B' }
    ]
  };

  // Mirrors hotkeys.js so a physical key press lights the matching on-screen key.
  const KEY_TO_PAD = {};
  for (const [cat, items] of Object.entries(CATS)) {
    for (const item of items) {
      const k = item.key.toLowerCase();
      if (cat === 'outer') KEY_TO_PAD[k] = { cat, base: item.base };
      if (cat === 'slice' || cat === 'rotation') KEY_TO_PAD[k] = { cat, base: item.base };
    }
  }
  const CTRL_TO_PAD = {};
  CATS.wide.forEach(i => { CTRL_TO_PAD[i.key.toLowerCase()] = { cat: 'wide', base: i.base }; });

  const pane = $('pane');
  const modSeg = $('modSeg');
  let activeCat = 'outer';
  let selectedMod = '';
  let heldMod = null; // "'" or '2' while Shift / Alt is held

  const effectiveMod = () => heldMod ?? selectedMod;
  const bindPrefix = item => {
    const m = effectiveMod();
    return (item.ctrl ? '⌃' : '') + (m === "'" ? '⇧' : m === '2' ? '⌥' : '');
  };

  function renderPad() {
    pane.replaceChildren();
    for (const item of CATS[activeCat]) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key';
      btn.dataset.base = item.base;
      btn.dataset.cat = activeCat;
      if (item.f) btn.dataset.f = item.f;
      if (item.ctrl) btn.dataset.wide = 'true';
      if (item.split) {
        btn.dataset.split = 'true';
        btn.style.setProperty('--a', item.split[0]);
        btn.style.setProperty('--b', item.split[1]);
      }
      const token = item.base + effectiveMod();
      btn.setAttribute('aria-label', `Move ${token}, keyboard ${bindPrefix(item)}${item.key}`);
      btn.append(document.createTextNode(token));
      const bind = document.createElement('span');
      bind.className = 'bind';
      bind.textContent = bindPrefix(item) + item.key;
      btn.append(bind);
      pane.append(btn);
    }
  }

  function setCategory(cat, animate = true) {
    activeCat = cat;
    document.querySelectorAll('.tab').forEach(tab => {
      const on = tab.dataset.cat === cat;
      tab.classList.toggle('on', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on) pane.setAttribute('aria-labelledby', tab.id);
    });
    renderPad();
    if (animate && !reduceMotion()) {
      pane.style.animation = 'none';
      void pane.offsetWidth;
      pane.style.animation = '';
    }
  }

  function refreshMod() {
    const m = effectiveMod();
    modSeg.classList.toggle('live', heldMod !== null);
    modSeg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.mod === m));
    renderPad();
  }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => setCategory(tab.dataset.cat));
    tab.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const tabs = [...document.querySelectorAll('.tab')];
      const next = tabs[(tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      setCategory(next.dataset.cat);
    });
  });

  modSeg.addEventListener('click', e => {
    const b = e.target.closest('button[data-mod]');
    if (!b) return;
    selectedMod = b.dataset.mod;
    refreshMod();
  });

  pane.addEventListener('click', e => {
    const key = e.target.closest('.key');
    if (!key) return;
    window.queueMove?.(key.dataset.base + effectiveMod());
  });

  function flashKey(cat, base) {
    if (activeCat !== cat) setCategory(cat, false);
    const el = pane.querySelector(`.key[data-base="${base}"]`);
    if (!el) return;
    el.classList.add('is-pressed');
    setTimeout(() => el.classList.remove('is-pressed'), 170);
  }

  function syncHeldModifier(e) {
    const next = e.altKey ? '2' : e.shiftKey ? "'" : null;
    if (next !== heldMod) {
      heldMod = next;
      refreshMod();
    }
  }

  /* ==========================================================
     2. Timer, inspection and TPS
     ========================================================== */
  const INSPECTION_MS = 15000;
  const timerEl = $('timer');
  const hudEl = $('hud');
  const T = {
    state: 'idle', inspectEnd: 0, t0: 0, moves: 0, raf: 0,
    best: parseFloat(store.get('rcube3d.best')) || null,
    last: parseFloat(store.get('rcube3d.last')) || null
  };

  const fmt = ms => {
    const s = ms / 1000;
    if (s < 60) return s.toFixed(2);
    const m = Math.floor(s / 60);
    return `${m}:${(s - m * 60).toFixed(2).padStart(5, '0')}`;
  };

  const STATE_TEXT = { idle: 'Ready', inspecting: 'Inspecting', solving: 'Solving', done: 'Solved' };
  const MAIN_LABEL = { idle: 'Start inspection', inspecting: 'Start solve now', solving: 'Stop', done: 'New attempt' };
  const HINTS = {
    idle: 'Inspect for 15 seconds, then your first turn starts the clock. It stops when the cube is solved.',
    inspecting: 'Rotations (C, V, B) are free during inspection. Any other turn starts the clock.',
    solving: 'The clock stops itself when every face is one color.',
    done: 'Time saved. Scramble again for the next attempt.'
  };

  function paintTimer(text, tps) {
    $('timerTime').textContent = text;
    $('hudTime').textContent = text;
    $('statMoves').textContent = T.moves;
    $('statTps').textContent = tps.toFixed(1);
    $('hudTps').textContent = tps.toFixed(1);
  }

  function paintStatic() {
    timerEl.dataset.state = T.state;
    hudEl.dataset.state = T.state;
    $('timerState').textContent = STATE_TEXT[T.state];
    $('timerMainLabel').textContent = MAIN_LABEL[T.state];
    $('timerHint').textContent = HINTS[T.state];
    $('statBest').textContent = T.best ? fmt(T.best) : '-';
    $('statLast').textContent = T.last ? fmt(T.last) : '-';
  }

  function tick(now) {
    if (T.state === 'inspecting') {
      const left = T.inspectEnd - now;
      if (left <= 0) { startSolve(); return; }
      const secs = Math.ceil(left / 1000);
      timerEl.dataset.warn = secs <= 3 ? '2' : secs <= 7 ? '1' : '0';
      $('inspectFill').style.transform = `scaleX(${left / INSPECTION_MS})`;
      paintTimer(String(secs), 0);
    } else if (T.state === 'solving') {
      const elapsed = now - T.t0;
      paintTimer(fmt(elapsed), T.moves / Math.max(elapsed / 1000, 0.001));
      if (T.moves > 0 && !window.RubiksCube.isAnimating && window.getPendingMoveCount() === 0 && window.RubiksCube.isSolved()) {
        finishSolve(now);
        return;
      }
    } else {
      return;
    }
    T.raf = requestAnimationFrame(tick);
  }

  function startInspection() {
    cancelAnimationFrame(T.raf);
    T.state = 'inspecting';
    T.moves = 0;
    T.inspectEnd = performance.now() + INSPECTION_MS;
    timerEl.dataset.warn = '0';
    paintStatic();
    T.raf = requestAnimationFrame(tick);
  }

  function startSolve() {
    cancelAnimationFrame(T.raf);
    T.state = 'solving';
    T.moves = 0;
    T.t0 = performance.now();
    paintStatic();
    T.raf = requestAnimationFrame(tick);
  }

  function finishSolve(now = performance.now()) {
    cancelAnimationFrame(T.raf);
    const elapsed = now - T.t0;
    T.state = 'done';
    T.last = elapsed;
    store.set('rcube3d.last', String(elapsed));
    if (!T.best || elapsed < T.best) {
      T.best = elapsed;
      store.set('rcube3d.best', String(elapsed));
    }
    paintStatic();
    paintTimer(fmt(elapsed), T.moves / Math.max(elapsed / 1000, 0.001));
    status(`Solved in ${fmt(elapsed)}s, ${T.moves} moves.`);
  }

  function resetTimer() {
    cancelAnimationFrame(T.raf);
    T.state = 'idle';
    T.moves = 0;
    $('inspectFill').style.transform = 'scaleX(1)';
    paintStatic();
    paintTimer('0.00', 0);
  }

  function timerAdvance() {
    if (T.state === 'idle' || T.state === 'done') startInspection();
    else if (T.state === 'inspecting') startSolve();
    else if (T.moves > 0) finishSolve();
    else resetTimer();
  }

  $('timerMain').addEventListener('click', timerAdvance);
  $('timerReset').addEventListener('click', resetTimer);

  /* ==========================================================
     3. Move queue and scrub
     ========================================================== */
  const MAX_SEQ = 400;
  const seq = { tokens: [], index: 0, cursor: 0, playing: false, dirty: true };
  const track = $('seqTrack');
  const scrub = $('scrub');
  const faceOf = t => (/^[RLUDFB]/.test(t) ? t[0] : /^[rludfb]/.test(t) ? t[0].toUpperCase() : '');

  function enqueueSeq(tokens, tag) {
    if (!tokens.length) return;
    try {
      window.enqueueCubeMoves(tokens, 'solving', tag);
    } catch (err) {
      status(err.message, true);
      setPlaying(false);
    }
  }

  function advanceTo(target) {
    target = Math.max(0, Math.min(seq.tokens.length, target));
    if (target > seq.cursor) {
      enqueueSeq(seq.tokens.slice(seq.cursor, target), 'seq:+');
    } else if (target < seq.cursor) {
      enqueueSeq(seq.tokens.slice(target, seq.cursor).reverse().map(window.invertMove), 'seq:-');
    }
    seq.cursor = target;
    renderSeq();
  }

  function loadSequence(tokens, label = '') {
    setPlaying(false);
    seq.tokens = tokens.slice(0, MAX_SEQ);
    seq.index = 0;
    seq.cursor = 0;
    seq.dirty = true;
    seq.label = label;
    renderSeq();
  }

  function renderSeq() {
    const len = seq.tokens.length;
    if (seq.dirty) {
      track.replaceChildren();
      if (!len) {
        const empty = document.createElement('p');
        empty.className = 'track-empty';
        empty.textContent = 'Nothing queued. Scramble the cube, pick an algorithm, or type one below.';
        track.append(empty);
      } else {
        seq.tokens.forEach((token, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'step';
          b.setAttribute('role', 'listitem');
          b.dataset.i = i;
          if (faceOf(token)) b.dataset.f = faceOf(token);
          b.textContent = token;
          b.setAttribute('aria-label', `Step ${i + 1}: ${token}`);
          track.append(b);
        });
      }
      seq.dirty = false;
    }

    const lo = Math.min(seq.index, seq.cursor);
    const hi = Math.max(seq.index, seq.cursor);
    const chips = track.children;
    if (len) {
      for (let i = 0; i < len; i++) {
        const c = chips[i];
        c.classList.toggle('done', i < lo);
        c.classList.toggle('queued', i >= lo && i < hi);
        c.classList.toggle('head', i >= hi && i === seq.cursor);
        c.classList.toggle('todo', i >= hi && i !== seq.cursor);
      }
      const focus = chips[Math.min(seq.cursor, len - 1)];
      if (focus) {
        track.scrollTo({
          left: focus.offsetLeft - track.clientWidth / 2 + focus.offsetWidth / 2,
          behavior: reduceMotion() ? 'auto' : 'smooth'
        });
      }
    }

    $('seqMeta').textContent = len ? `${seq.index} / ${len}${seq.label ? '  ' + seq.label : ''}` : 'Empty';
    scrub.max = len;
    scrub.value = seq.cursor;
    scrub.disabled = !len;
    scrub.style.setProperty('--p', len ? `${(seq.cursor / len) * 100}%` : '0%');
    for (const id of ['tStart', 'tBack', 'tFwd', 'tEnd', 'tPlay', 'seqInvert', 'seqClear']) $(id).disabled = !len;
    $('qPlay').disabled = !len;
  }

  function setPlaying(on) {
    seq.playing = on;
    const icon = on ? '#i-pause' : '#i-play';
    $('tPlay').querySelector('use').setAttribute('href', icon);
    $('tPlay').setAttribute('aria-label', on ? 'Pause' : 'Play');
    $('qPlay').querySelector('use').setAttribute('href', icon);
    $('qPlay').querySelector('span').textContent = on ? 'Pause' : 'Play';
    $('qPlay').classList.toggle('is-on', on);
    if (on) requestAnimationFrame(playLoop);
  }

  function playLoop() {
    if (!seq.playing) return;
    if (seq.cursor >= seq.tokens.length) {
      if (window.getPendingMoveCount() === 0) setPlaying(false);
    } else if (window.getPendingMoveCount() === 0) {
      advanceTo(seq.cursor + 1);
    }
    requestAnimationFrame(playLoop);
  }

  function togglePlay() {
    if (!seq.tokens.length) { status('Nothing to play yet.'); return; }
    if (seq.playing) { setPlaying(false); return; }
    if (seq.cursor >= seq.tokens.length) advanceTo(0);
    setPlaying(true);
  }

  function parseAlg(raw) {
    const text = raw.replace(/[‘’′]/g, "'").replace(/[()\[\],]/g, ' ').trim();
    if (!text) return { error: 'Enter at least one move.' };
    const tokens = text.split(/\s+/).map(t => t.replace(/^([A-Za-z]w?)2'$/, '$12').replace(/^([A-Za-z]w?)'2$/, '$12'));
    if (tokens.length > MAX_SEQ) return { error: `Sequences are limited to ${MAX_SEQ} moves.` };
    const bad = tokens.find(t => !window.MOVE_TOKEN.test(t));
    if (bad) return { error: `"${bad}" is not a valid move. Use R L U D F B, r l u d f b, M E S, x y z with ' or 2.` };
    return { tokens };
  }

  function runAlgorithm(tokens, label, play = true) {
    loadSequence(tokens, label);
    if (play) setPlaying(true);
  }

  $('algForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('alg-input');
    const err = $('algError');
    const result = parseAlg(input.value);
    if (result.error) {
      err.textContent = result.error;
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    err.textContent = '';
    input.removeAttribute('aria-invalid');
    document.querySelectorAll('.chip.is-loaded').forEach(c => c.classList.remove('is-loaded'));
    runAlgorithm(result.tokens, 'Custom');
    input.blur();
    focusCube();
  });
  $('alg-input').addEventListener('input', () => {
    $('algError').textContent = '';
    $('alg-input').removeAttribute('aria-invalid');
  });

  track.addEventListener('click', e => {
    const step = e.target.closest('.step');
    if (!step) return;
    setPlaying(false);
    advanceTo(Number(step.dataset.i) + 1);
  });
  track.addEventListener('wheel', e => {
    if (track.scrollWidth <= track.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    track.scrollLeft += e.deltaY;
  }, { passive: false });

  scrub.addEventListener('input', () => { setPlaying(false); advanceTo(Number(scrub.value)); });
  $('tStart').addEventListener('click', () => { setPlaying(false); advanceTo(0); });
  $('tEnd').addEventListener('click', () => { setPlaying(false); advanceTo(seq.tokens.length); });
  $('tBack').addEventListener('click', () => { setPlaying(false); advanceTo(seq.cursor - 1); });
  $('tFwd').addEventListener('click', () => { setPlaying(false); advanceTo(seq.cursor + 1); });
  $('tPlay').addEventListener('click', togglePlay);
  $('seqClear').addEventListener('click', () => loadSequence([]));
  $('seqInvert').addEventListener('click', () => {
    loadSequence([...seq.tokens].reverse().map(window.invertMove), 'Inverse');
    status('Inverse loaded. Press play to run it.');
  });

  $('speed').addEventListener('click', e => {
    const b = e.target.closest('button[data-speed]');
    if (!b) return;
    $('speed').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    window.RubiksCube.setTurnDuration(200 / Number(b.dataset.speed));
  });

  // Engine events
  document.addEventListener('cube:sequence', e => {
    // Scramble: controls.js enqueues the moves itself, so the playhead starts at the end.
    loadSequence(e.detail.tokens, e.detail.label);
    seq.cursor = seq.tokens.length;
    renderSeq();
  });

  document.addEventListener('cube:move', e => {
    const { token, kind, tag } = e.detail;
    if (tag === 'seq:+') seq.index = Math.min(seq.tokens.length, seq.index + 1);
    if (tag === 'seq:-') seq.index = Math.max(0, seq.index - 1);
    if (tag) renderSeq();

    if (kind === 'scramble') return;
    if (T.state === 'inspecting' && !/^[xyz]/.test(token)) {
      startSolve();
      T.moves = 1;
    } else if (T.state === 'solving') {
      T.moves += 1;
    }
  });

  document.addEventListener('cube:reset', () => {
    setPlaying(false);
    seq.index = 0;
    seq.cursor = 0;
    renderSeq();
    resetTimer();
  });

  /* ==========================================================
     4. Algorithm library
     ========================================================== */
  const ALGS = [
    { name: 'Sexy move', alg: "R U R' U'", c: 'var(--face-r)' },
    { name: 'Sune', alg: "R U R' U R U2 R'", c: 'var(--face-u)' },
    { name: 'Antisune', alg: "R U2 R' U' R U' R'", c: 'var(--face-l)' },
    { name: 'T-Perm', alg: "R U R' U' R' F R2 U' R' U' R U R' F'", c: 'var(--face-f)' },
    { name: 'J-Perm', alg: "R U R' F' R U R' U' R' F R2 U' R' U'", c: 'var(--face-b)' },
    { name: 'Y-Perm', alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'", c: 'var(--face-d)' },
    { name: 'Sledgehammer', alg: "R' F R F'", c: 'var(--face-r)' },
    { name: 'Checkerboard', alg: 'M2 E2 S2', c: 'var(--face-l)' }
  ];
  const peek = $('algPeek');
  const PEEK_DEFAULT = 'Hover a chip to preview its moves.';
  let loadedAlg = null;

  ALGS.forEach(item => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.style.setProperty('--c', item.c);
    const dot = document.createElement('i');
    const label = document.createElement('span');
    label.textContent = item.name;
    const count = document.createElement('small');
    count.textContent = item.alg.split(' ').length;
    chip.append(dot, label, count);
    chip.setAttribute('aria-label', `${item.name}: ${item.alg}`);

    const show = () => { peek.textContent = `${item.name}: ${item.alg}`; };
    const hide = () => { peek.textContent = loadedAlg ? `${loadedAlg.name}: ${loadedAlg.alg}` : PEEK_DEFAULT; };
    chip.addEventListener('mouseenter', show);
    chip.addEventListener('focus', show);
    chip.addEventListener('mouseleave', hide);
    chip.addEventListener('blur', hide);
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip.is-loaded').forEach(c => c.classList.remove('is-loaded'));
      chip.classList.add('is-loaded');
      loadedAlg = item;
      $('alg-input').value = item.alg;
      $('algError').textContent = '';
      runAlgorithm(item.alg.split(' '), item.name, $('autoplay').checked);
      status($('autoplay').checked ? `Running ${item.name}.` : `${item.name} loaded. Use play or step through it.`);
    });
    $('chips').append(chip);
  });

  /* ==========================================================
     5. Camera presets
     ========================================================== */
  const camBtns = [...document.querySelectorAll('.cam-btn')];
  const CAM_KEYS = { 1: 'iso', 2: 'top', 3: 'front', 4: 'reset' };

  function setView(name) {
    window.setCameraView?.(name);
    camBtns.forEach(b => b.classList.toggle('is-active', b.dataset.view === name && name !== 'reset'));
    const btn = camBtns.find(b => b.dataset.view === name);
    if (btn) {
      btn.classList.add('is-pressed');
      setTimeout(() => btn.classList.remove('is-pressed'), 160);
    }
  }
  camBtns.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  $('canvas-container').addEventListener('pointerdown', () => camBtns.forEach(b => b.classList.remove('is-active')));

  /* ==========================================================
     6. Quick actions (speed dial on mobile)
     ========================================================== */
  const quick = $('quick');
  const fab = $('qFab');
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;
  const setQuick = open => {
    quick.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', String(open));
  };
  const afterQuick = () => { if (isMobile()) setQuick(false); };

  fab.addEventListener('click', () => setQuick(!quick.classList.contains('open')));
  document.addEventListener('pointerdown', e => {
    if (isMobile() && !quick.contains(e.target)) setQuick(false);
  });
  $('qScramble').addEventListener('click', () => { window.scrambleCube(); afterQuick(); });
  $('qUndo').addEventListener('click', () => { window.undoCubeMove(); afterQuick(); });
  $('qReset').addEventListener('click', () => { window.resetCube(); afterQuick(); });
  $('qPlay').addEventListener('click', () => { togglePlay(); afterQuick(); });

  /* ==========================================================
     7. Keyboard: light keycaps, timer, camera
     ========================================================== */
  window.addEventListener('keydown', e => {
    syncHeldModifier(e);
    if (e.repeat || e.isComposing || isTyping(e.target)) return;

    if (e.key === 'Escape') { setQuick(false); return; }
    if (e.key === '\\' && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); panelBtn.click(); return; }

    const k = e.key.toLowerCase();

    if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && CAM_KEYS[k]) {
      setView(CAM_KEYS[k]);
      return;
    }

    if (e.code === 'Space' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault(); // global timer key, even when a button has focus
      timerAdvance();
      return;
    }

    if (e.metaKey) return;
    const hit = e.ctrlKey ? CTRL_TO_PAD[k] : KEY_TO_PAD[k];
    if (hit && !(e.ctrlKey && !CTRL_TO_PAD[k])) flashKey(hit.cat, hit.base);
  });
  window.addEventListener('keyup', e => {
    syncHeldModifier(e);
    if (e.code === 'Space' && !isTyping(e.target)) e.preventDefault(); // stop native button click
  });
  window.addEventListener('blur', () => { if (heldMod !== null) { heldMod = null; refreshMod(); } });

  /* ==========================================================
     Init
     ========================================================== */
  setCategory('outer', false);
  refreshMod();
  paintStatic();
  paintTimer('0.00', 0);
  renderSeq();
  setPlaying(false);
})();