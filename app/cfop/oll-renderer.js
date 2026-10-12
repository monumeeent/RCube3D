// cfop/oll-renderer.js
// Files Connected: [index.html, cfop/cfop-data.js, cfop/cfop-drawer.js]
// Work: Top-down OLL orientation diagram renderer, rebuilt on a real cube simulation
//   instead of a hand-authored per-case sticker table. Replaces the previous renderer,
//   which mis-rendered the oriented middle edge for OLL 43 and OLL 44 (P-shapes).
// How it works: takes the case's solving algorithm, computes its exact inverse, and
//   runs that inverse on a solved virtual cube (same move-vector engine as
//   pll-renderer.js). The resulting state IS the recognition case: applying the
//   algorithm to it is guaranteed to re-solve it. From there every corner/edge slot's
//   orientation is read directly off the simulated stickers, so every case (including
//   43/44) is derived the same correct way instead of by hand.
// Last Edit Time: 2026-10-11

'use strict';

(() => {
  const COLORS = {
    U: '#ffd500',
    N: 'var(--s4, #3a3d4a)',
    line: 'var(--line-strong, #1e2029)'
  };

  // ── Cube simulation (shared approach with pll-renderer.js) ──────────────
  const vector = (x, y, z) => ({ x, y, z });

  function rotateVector(v, axis, quarterTurns) {
    let { x, y, z } = v;
    const turns = ((quarterTurns % 4) + 4) % 4;
    for (let i = 0; i < turns; i++) {
      if (axis === 'x') [y, z] = [-z, y];
      else if (axis === 'y') [x, z] = [z, -x];
      else [x, y] = [-y, x];
    }
    return { x, y, z };
  }

  function makeSolvedCube() {
    const cubies = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const stickers = [];
          if (x === 1) stickers.push({ color: 'R', normal: vector(1, 0, 0) });
          if (x === -1) stickers.push({ color: 'L', normal: vector(-1, 0, 0) });
          if (y === 1) stickers.push({ color: 'U', normal: vector(0, 1, 0) });
          if (y === -1) stickers.push({ color: 'D', normal: vector(0, -1, 0) });
          if (z === 1) stickers.push({ color: 'F', normal: vector(0, 0, 1) });
          if (z === -1) stickers.push({ color: 'B', normal: vector(0, 0, -1) });
          if (stickers.length) cubies.push({ home: vector(x, y, z), position: vector(x, y, z), stickers });
        }
      }
    }
    return cubies;
  }

  function applyMove(cubies, token) {
    const match = /^([RLUDFBMESrludfbxyz])(2'|2|')?$/.exec(token);
    if (!match) throw new Error(`Unsupported OLL move: ${token}`);

    const move = match[1];
    const raw = match[2] || '';
    // "2'" is a 180-degree turn; direction is irrelevant at 180, so treat it as "2".
    const suffix = raw.startsWith('2') ? '2' : raw;
    let axis, layer, quarter, wide = false, wholeCube = false;

    switch (move) {
      case 'R': axis = 'x'; layer = 1; quarter = -1; break;
      case 'L': axis = 'x'; layer = -1; quarter = 1; break;
      case 'U': axis = 'y'; layer = 1; quarter = -1; break;
      case 'D': axis = 'y'; layer = -1; quarter = 1; break;
      case 'F': axis = 'z'; layer = 1; quarter = -1; break;
      case 'B': axis = 'z'; layer = -1; quarter = 1; break;
      case 'M': axis = 'x'; layer = 0; quarter = 1; break;
      case 'E': axis = 'y'; layer = 0; quarter = 1; break;
      case 'S': axis = 'z'; layer = 0; quarter = -1; break;
      case 'r': axis = 'x'; layer = 1; quarter = -1; wide = true; break;
      case 'l': axis = 'x'; layer = -1; quarter = 1; wide = true; break;
      case 'u': axis = 'y'; layer = 1; quarter = -1; wide = true; break;
      case 'd': axis = 'y'; layer = -1; quarter = 1; wide = true; break;
      case 'f': axis = 'z'; layer = 1; quarter = -1; wide = true; break;
      case 'b': axis = 'z'; layer = -1; quarter = 1; wide = true; break;
      case 'x': axis = 'x'; quarter = -1; wholeCube = true; break;
      case 'y': axis = 'y'; quarter = -1; wholeCube = true; break;
      case 'z': axis = 'z'; quarter = -1; wholeCube = true; break;
    }

    if (suffix === "'") quarter *= -1;
    const repetitions = suffix === '2' ? 2 : 1;
    for (let repeat = 0; repeat < repetitions; repeat++) {
      for (const cubie of cubies) {
        const coordinate = cubie.position[axis];
        const inLayer = wholeCube || (wide
          ? (layer > 0 ? coordinate >= 0 : coordinate <= 0)
          : coordinate === layer);
        if (!inLayer) continue;
        cubie.position = rotateVector(cubie.position, axis, quarter);
        cubie.stickers.forEach(sticker => {
          sticker.normal = rotateVector(sticker.normal, axis, quarter);
        });
      }
    }
  }

  function invertAlgTokens(algStr) {
    const tokens = String(algStr || '').replace(/[()[\]]/g, '').trim().split(/\s+/).filter(Boolean);
    return tokens.reverse().map(token => {
      const match = /^([A-Za-z]+)(2'|2|')?$/.exec(token);
      if (!match) return token;
      const [, base, suffix] = match;
      if (suffix === '2' || suffix === "2'") return `${base}2`;
      if (suffix === "'") return base;
      return `${base}'`;
    });
  }

  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cross(a, b) {
    return vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }

  function getLocalFrame(cubies) {
    const centers = {};
    cubies.forEach(cubie => {
      if (cubie.stickers.length === 1) centers[cubie.stickers[0].color] = cubie.stickers[0].normal;
    });
    const up = centers.U;
    const front = centers.F;
    const right = cross(up, front);
    return v => ({ x: dot(v, right), y: dot(v, up), z: dot(v, front) });
  }

  // U-layer slots. Each corner/edge also records which side face(s) a flap can
  // bleed onto when that piece is not oriented (yellow not facing up).
  const EDGE_SLOTS = [
    { label: 'UB', v: vector(0, 1, -1), side: 'B' },
    { label: 'UR', v: vector(1, 1, 0), side: 'R' },
    { label: 'UF', v: vector(0, 1, 1), side: 'F' },
    { label: 'UL', v: vector(-1, 1, 0), side: 'L' }
  ];
  const CORNER_SLOTS = [
    { label: 'UBL', v: vector(-1, 1, -1), sides: ['B', 'L'] },
    { label: 'UBR', v: vector(1, 1, -1), sides: ['B', 'R'] },
    { label: 'UFR', v: vector(1, 1, 1), sides: ['F', 'R'] },
    { label: 'UFL', v: vector(-1, 1, 1), sides: ['F', 'L'] }
  ];

  function axisOf(local) {
    if (local.y > 0.9) return 'U';
    if (local.x > 0.9) return 'R';
    if (local.x < -0.9) return 'L';
    if (local.z > 0.9) return 'F';
    if (local.z < -0.9) return 'B';
    return null;
  }

  function nearestSlot(local, slots) {
    let best = null, bestDist = Infinity;
    for (const slot of slots) {
      const d = (local.x - slot.v.x) ** 2 + (local.y - slot.v.y) ** 2 + (local.z - slot.v.z) ** 2;
      if (d < bestDist) { bestDist = d; best = slot; }
    }
    return best;
  }

  // Simulates the recognition case (inverse of the solving algorithm, applied to a
  // solved cube) and reads off, per slot, whether it's oriented (yellow facing up)
  // and if not, which adjacent side the yellow sticker actually sits on.
  //
  // Slots are resolved by asking "which piece currently sits here" (scanning every
  // edge/corner cubie's post-simulation position) rather than "where did the piece
  // that started here end up". Tracing a named origin piece can walk it out of the
  // U layer on an intermediate move and lose track of it entirely for algorithms
  // that only restore the layer by the end of the full sequence; scanning current
  // positions is immune to that and always yields a complete, gap-free diagram.
  function simulateOll(algStr) {
    const cubies = makeSolvedCube();
    invertAlgTokens(algStr).forEach(token => applyMove(cubies, token));
    const toLocal = getLocalFrame(cubies);

    const edgeOriented = {};  // { UF: true/false }
    const cornerOriented = {}; // { UFR: true/false }
    const cornerFlapSide = {}; // { UFR: 'F' | 'R' | null }

    cubies.forEach(cubie => {
      const isEdge = cubie.stickers.length === 2;
      const isCorner = cubie.stickers.length === 3;
      if (!isEdge && !isCorner) return;

      const localPos = toLocal(cubie.position);
      if (Math.round(localPos.y) !== 1) return; // not currently in the U layer

      if (isEdge) {
        const slot = nearestSlot(localPos, EDGE_SLOTS);
        let upIsYellow = false;
        cubie.stickers.forEach(sticker => {
          if (axisOf(toLocal(sticker.normal)) === 'U' && sticker.color === 'U') upIsYellow = true;
        });
        edgeOriented[slot.label] = upIsYellow;
      } else {
        const slot = nearestSlot(localPos, CORNER_SLOTS);
        let upIsYellow = false;
        let flapSide = null;
        cubie.stickers.forEach(sticker => {
          const ax = axisOf(toLocal(sticker.normal));
          if (ax === 'U' && sticker.color === 'U') upIsYellow = true;
          if (sticker.color === 'U' && slot.sides.includes(ax)) flapSide = ax;
        });
        cornerOriented[slot.label] = upIsYellow;
        cornerFlapSide[slot.label] = upIsYellow ? null : flapSide;
      }
    });

    // Defensive fallback: a slot can only be left unfilled if an algorithm string
    // is not truly layer-preserving (a data error upstream). Default it to
    // "unoriented, no flap" so the diagram still renders in full rather than
    // leaving a visual gap.
    EDGE_SLOTS.forEach(slot => { if (!(slot.label in edgeOriented)) edgeOriented[slot.label] = false; });
    CORNER_SLOTS.forEach(slot => {
      if (!(slot.label in cornerOriented)) { cornerOriented[slot.label] = false; cornerFlapSide[slot.label] = null; }
    });

    return { edgeOriented, cornerOriented, cornerFlapSide };
  }

  // ── Layout: 66x66 viewBox matching the app's existing OLL card convention ──
  const CELL = 16;
  const INNER = 8; // inner 3x3 grid spans 8..60

  function cell(x, y, fill) {
    return `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="1" fill="${fill}" stroke="${COLORS.line}" stroke-width="1"></rect>`;
  }
  function flapTop(x, fill) { return `<rect x="${x}" y="1" width="${CELL}" height="4" rx="1" fill="${fill}" stroke="${COLORS.line}" stroke-width="0.8"></rect>`; }
  function flapBottom(x, fill) { return `<rect x="${x}" y="61" width="${CELL}" height="4" rx="1" fill="${fill}" stroke="${COLORS.line}" stroke-width="0.8"></rect>`; }
  function flapLeft(y, fill) { return `<rect x="1" y="${y}" width="4" height="${CELL}" rx="1" fill="${fill}" stroke="${COLORS.line}" stroke-width="0.8"></rect>`; }
  function flapRight(y, fill) { return `<rect x="61" y="${y}" width="4" height="${CELL}" rx="1" fill="${fill}" stroke="${COLORS.line}" stroke-width="0.8"></rect>`; }

  const CORNER_POS = { UBL: { x: INNER, y: INNER }, UBR: { x: INNER + 2 * CELL, y: INNER }, UFR: { x: INNER + 2 * CELL, y: INNER + 2 * CELL }, UFL: { x: INNER, y: INNER + 2 * CELL } };
  const EDGE_POS = { UB: { x: INNER + CELL, y: INNER }, UR: { x: INNER + 2 * CELL, y: INNER + CELL }, UF: { x: INNER + CELL, y: INNER + 2 * CELL }, UL: { x: INNER, y: INNER + CELL } };

  function buildOllSVG(algStr) {
    if (!algStr) return fallbackDiagram();

    let sim;
    try {
      sim = simulateOll(algStr);
    } catch (error) {
      console.warn('[oll-renderer] Could not simulate OLL algorithm:', algStr, error);
      return fallbackDiagram();
    }

    let svg = '';

    // Center is always yellow (U center sticker never moves or flips).
    svg += cell(INNER + CELL, INNER + CELL, COLORS.U);

    // Corners + their flaps.
    for (const label of ['UBL', 'UBR', 'UFR', 'UFL']) {
      const pos = CORNER_POS[label];
      const oriented = sim.cornerOriented[label];
      svg += cell(pos.x, pos.y, oriented ? COLORS.U : COLORS.N);

      if (!oriented) {
        const flapSide = sim.cornerFlapSide[label];
        if (flapSide === 'B') svg += flapTop(pos.x, COLORS.U);
        else if (flapSide === 'F') svg += flapBottom(pos.x, COLORS.U);
        else if (flapSide === 'L') svg += flapLeft(pos.y, COLORS.U);
        else if (flapSide === 'R') svg += flapRight(pos.y, COLORS.U);
      }
    }

    // Edges + their single-side flap.
    for (const label of ['UB', 'UR', 'UF', 'UL']) {
      const pos = EDGE_POS[label];
      const oriented = sim.edgeOriented[label];
      svg += cell(pos.x, pos.y, oriented ? COLORS.U : COLORS.N);

      if (!oriented) {
        if (label === 'UB') svg += flapTop(pos.x, COLORS.U);
        else if (label === 'UF') svg += flapBottom(pos.x, COLORS.U);
        else if (label === 'UL') svg += flapLeft(pos.y, COLORS.U);
        else if (label === 'UR') svg += flapRight(pos.y, COLORS.U);
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" width="100%" height="100%" style="display:block; max-width:64px; max-height:64px;" aria-hidden="true">${svg}</svg>`;
  }

  function fallbackDiagram() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" width="100%" height="100%" aria-hidden="true">${cell(INNER + CELL, INNER + CELL, COLORS.N)}</svg>`;
  }

  window.OllSVG = { buildOllSVG, simulateOll };
})();