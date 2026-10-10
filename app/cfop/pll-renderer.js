// app/cfop/pll-renderer.js
// Files Connected: [index.html, cfop/cfop-drawer.js, cfop/pll-data.js]
// Work: Top-down PLL permutation diagram renderer (algorithm-derived, not hand-drawn)
// Purpose: Simulates each PLL algorithm from a solved cube and draws the classic top-view
//   diagram speedcubers expect: a yellow U face framed by the four side colors (F/R/B/L),
//   with arrows showing which pieces swap. Mirrors the OLL renderer's "viewed from top" format.
// Last Edit Time: 2026-10-10

'use strict';

(() => {
  const COLORS = {
    U: 'var(--face-u, #ffd500)',
    F: 'var(--face-f, #2f74e0)',
    R: 'var(--face-r, #d12a2a)',
    B: 'var(--face-b, #12b45c)',
    L: 'var(--face-l, #ff5900)',
    line: 'var(--line-strong, #1e2029)',
    neutral: 'var(--s4, #3a3d4a)',
    edgeArrow: '#40c4ff',
    cornerArrow: '#ff5b6e',
    text: 'var(--text-muted, #aeb4c2)'
  };

  // ── Cube simulation (coordinates: x=right, y=up, z=front) ───────────────
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
    const match = /^([RLUDFBMESrludfbxyz])(?:([2])|('))?$/.exec(token);
    if (!match) throw new Error(`Unsupported PLL move: ${token}`);

    const move = match[1];
    const suffix = match[2] ? '2' : match[3] ? "'" : '';
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

  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cross(a, b) {
    return vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }

  // Returns a function that converts a world-space vector into the solver's
  // local frame (right/up/front), so the diagram always reads F-at-bottom,
  // B-at-top, R-right, L-left regardless of which moves were used.
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

  function samePosition(a, b) { return a.x === b.x && a.y === b.y && a.z === b.z; }
  function pieceKey(cubie) { return cubie.stickers.map(sticker => sticker.color).sort().join(''); }

  // U-layer slot definitions, ordered to match the on-screen layout helpers below.
  const EDGE_SLOTS = [
    { label: 'UF', v: vector(0, 1, 1) },
    { label: 'UR', v: vector(1, 1, 0) },
    { label: 'UB', v: vector(0, 1, -1) },
    { label: 'UL', v: vector(-1, 1, 0) }
  ];
  const CORNER_SLOTS = [
    { label: 'UFR', v: vector(1, 1, 1) },
    { label: 'UBR', v: vector(1, 1, -1) },
    { label: 'UBL', v: vector(-1, 1, -1) },
    { label: 'UFL', v: vector(-1, 1, 1) }
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

  // Simulates the algorithm and returns, for every U-layer slot, which piece
  // ended up there plus the real colors now facing each visible direction.
  function simulatePll(alg) {
    const cubies = makeSolvedCube();
    const tokens = String(alg || '').replace(/[()[\]]/g, '').trim().split(/\s+/).filter(Boolean);
    tokens.forEach(token => applyMove(cubies, token));
    const toLocal = getLocalFrame(cubies);

    const edgeColorAt = {};   // { UF: '#...' }
    const cornerColorAt = {}; // { UFR: { F: '#...', R: '#...' } }
    const moves = []; // [{ kind: 'edge'|'corner', from, to }]

    function resolve(slots, isCorner) {
      slots.forEach(origin => {
        const originalPiece = cubies.find(c => samePosition(c.home, origin.v));
        const key = pieceKey(originalPiece);
        const movedPiece = cubies.find(c => pieceKey(c) === key);
        const destLocal = toLocal(movedPiece.position);
        const dest = nearestSlot(destLocal, slots);

        if (dest.label !== origin.label) moves.push({ kind: isCorner ? 'corner' : 'edge', from: origin.label, to: dest.label });

        const bucket = isCorner ? (cornerColorAt[dest.label] || (cornerColorAt[dest.label] = {})) : null;
        movedPiece.stickers.forEach(sticker => {
          const localNormal = toLocal(sticker.normal);
          const ax = axisOf(localNormal);
          if (!ax || ax === 'U') return;
          if (isCorner) bucket[ax] = COLORS[sticker.color] || COLORS.neutral;
          else edgeColorAt[dest.label] = COLORS[sticker.color] || COLORS.neutral;
        });
      });
    }

    resolve(EDGE_SLOTS, false);
    resolve(CORNER_SLOTS, true);
    return { edgeColorAt, cornerColorAt, moves };
  }

  // ── Layout: 100x100 viewBox, yellow 3x3 center ringed by F/R/B/L stickers ──
  const CELL = 12;
  const INNER = 32; // inner square starts/ends at 32..68

  const EDGE_ANCHOR = { UB: { x: 50, y: 26 }, UR: { x: 74, y: 50 }, UF: { x: 50, y: 74 }, UL: { x: 26, y: 50 } };
  const CORNER_ANCHOR = { UBL: { x: 26, y: 26 }, UBR: { x: 74, y: 26 }, UFR: { x: 74, y: 74 }, UFL: { x: 26, y: 74 } };

  function rect(x, y, size, fill) {
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}" stroke="${COLORS.line}" stroke-width="0.8"/>`;
  }

  function buildFrame(edgeColorAt, cornerColorAt) {
    let svg = '';

    // Inner 3x3 U face: always yellow (PLL assumes the last layer is already oriented).
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        svg += rect(INNER + col * CELL, INNER + row * CELL, CELL, COLORS.U);
      }
    }

    const fallback = COLORS.neutral;

    // Top row = B face: UBL | UB | UBR
    svg += rect(INNER, INNER - CELL, CELL, (cornerColorAt.UBL && cornerColorAt.UBL.B) || fallback);
    svg += rect(INNER + CELL, INNER - CELL, CELL, edgeColorAt.UB || fallback);
    svg += rect(INNER + 2 * CELL, INNER - CELL, CELL, (cornerColorAt.UBR && cornerColorAt.UBR.B) || fallback);

    // Bottom row = F face: UFL | UF | UFR
    svg += rect(INNER, INNER + 3 * CELL, CELL, (cornerColorAt.UFL && cornerColorAt.UFL.F) || fallback);
    svg += rect(INNER + CELL, INNER + 3 * CELL, CELL, edgeColorAt.UF || fallback);
    svg += rect(INNER + 2 * CELL, INNER + 3 * CELL, CELL, (cornerColorAt.UFR && cornerColorAt.UFR.F) || fallback);

    // Left col = L face: UBL | UL | UFL
    svg += rect(INNER - CELL, INNER, CELL, (cornerColorAt.UBL && cornerColorAt.UBL.L) || fallback);
    svg += rect(INNER - CELL, INNER + CELL, CELL, edgeColorAt.UL || fallback);
    svg += rect(INNER - CELL, INNER + 2 * CELL, CELL, (cornerColorAt.UFL && cornerColorAt.UFL.L) || fallback);

    // Right col = R face: UBR | UR | UFR
    svg += rect(INNER + 3 * CELL, INNER, CELL, (cornerColorAt.UBR && cornerColorAt.UBR.R) || fallback);
    svg += rect(INNER + 3 * CELL, INNER + CELL, CELL, edgeColorAt.UR || fallback);
    svg += rect(INNER + 3 * CELL, INNER + 2 * CELL, CELL, (cornerColorAt.UFR && cornerColorAt.UFR.R) || fallback);

    return svg;
  }

  function arrowPath(from, to, bend, color, markerId) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / length;
    const uy = dy / length;
    const nx = -uy, ny = ux;
    const startX = from.x + ux * 5.5;
    const startY = from.y + uy * 5.5;
    const endX = to.x - ux * 6.5;
    const endY = to.y - uy * 6.5;
    const cx = (from.x + to.x) / 2 + nx * bend;
    const cy = (from.y + to.y) / 2 + ny * bend;
    return `<path d="M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" marker-end="url(#${markerId})" opacity="0.95"/>`;
  }

  function buildArrows(moves) {
    let svg = '';
    moves.forEach((move, i) => {
      const anchors = move.kind === 'edge' ? EDGE_ANCHOR : CORNER_ANCHOR;
      const from = anchors[move.from];
      const to = anchors[move.to];
      if (!from || !to) return;
      const color = move.kind === 'edge' ? COLORS.edgeArrow : COLORS.cornerArrow;
      const marker = move.kind === 'edge' ? 'pll-edge-arrow' : 'pll-corner-arrow';
      const bend = (i % 2 ? -1 : 1) * 10;
      svg += arrowPath(from, to, bend, color, marker);
    });
    return svg;
  }

  function buildPllSVG(caseData) {
    if (!caseData || !caseData.alg) return fallbackDiagram();

    let sim;
    try {
      sim = simulatePll(caseData.alg);
    } catch (error) {
      console.warn('[pll-renderer] Could not simulate PLL algorithm:', caseData.id, error);
      return fallbackDiagram();
    }

    const defs = `
      <defs>
        <marker id="pll-edge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="${COLORS.edgeArrow}"/></marker>
        <marker id="pll-corner-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="${COLORS.cornerArrow}"/></marker>
      </defs>`;

    const frame = buildFrame(sim.edgeColorAt, sim.cornerColorAt);
    const arrows = buildArrows(sim.moves);
    const name = escapeText(caseData.name || 'PLL');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" style="display:block; max-width:88px; max-height:88px" role="img" aria-label="${name}, viewed from the top, with arrows showing which pieces swap">${defs}${frame}${arrows}</svg>`;
  }

  function fallbackDiagram() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${rect(32, 32, 36, COLORS.neutral)}</svg>`;
  }

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
  }

  window.PllSVG = { buildPllSVG, simulatePll };
})();