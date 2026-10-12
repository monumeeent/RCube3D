// cfop/wv-renderer.js
// Files Connected: [index.html, cfop/wv-data.js, cfop/cfop-drawer.js]
// Work: Winter Variation (WV) Top-Down Renderer — Robust Color Tracking with Slim Flaps
'use strict';

(() => {
  const COLORS = {
    U: 'var(--face-u, #ffd500)',
    F: 'var(--face-f, #2f74e0)',
    R: 'var(--face-r, #d12a2a)',
    D: '#ffffff',
    line: 'var(--line-strong, #1e2029)',
    neutral: 'var(--s4, #3a3d4a)'
  };

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
    if (!match) return;
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
    const reps = suffix === '2' ? 2 : 1;
    for (let r = 0; r < reps; r++) {
      for (const cubie of cubies) {
        const coord = cubie.position[axis];
        const inLayer = wholeCube || (wide ? (layer > 0 ? coord >= 0 : coord <= 0) : coord === layer);
        if (!inLayer) continue;
        cubie.position = rotateVector(cubie.position, axis, quarter);
        cubie.stickers.forEach(s => { s.normal = rotateVector(s.normal, axis, quarter); });
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
  function cross(a, b) { return vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }

  function getLocalFrame(cubies) {
    const centers = {};
    cubies.forEach(c => { if (c.stickers.length === 1) centers[c.stickers[0].color] = c.stickers[0].normal; });
    const up = centers.U || vector(0, 1, 0);
    const front = centers.F || vector(0, 0, 1);
    const right = cross(up, front);
    return v => ({ x: dot(v, right), y: dot(v, up), z: dot(v, front) });
  }

  function simulateWv(algStr) {
    const cubies = makeSolvedCube();
    invertAlgTokens(algStr).forEach(token => applyMove(cubies, token));
    const toLocal = getLocalFrame(cubies);

    const uColors = Array(9).fill(COLORS.neutral);
    uColors[4] = COLORS.U; // Center

    const edgeColorAt = {};
    const cornerColorAt = {};

    function axisOf(local) {
      if (local.y > 0.9) return 'U';
      if (local.x > 0.9) return 'R';
      if (local.x < -0.9) return 'L';
      if (local.z > 0.9) return 'F';
      if (local.z < -0.9) return 'B';
      return null;
    }

    cubies.forEach(cubie => {
      const pos = toLocal(cubie.position);
      const rx = Math.round(pos.x);
      const ry = Math.round(pos.y);
      const rz = Math.round(pos.z);

      if (ry === 1) {
        cubie.stickers.forEach(s => {
          const norm = toLocal(s.normal);
          const ax = axisOf(norm);
          if (ax === 'U') {
            const idx = (rz + 1) * 3 + (rx + 1);
            if (idx >= 0 && idx < 9) {
              uColors[idx] = s.color === 'U' ? COLORS.U : (COLORS[s.color] || COLORS.neutral);
            }
          } else if (ax && ax !== 'U') {
            if (rx === 0 && rz === -1) edgeColorAt.UB = COLORS[s.color] || COLORS.neutral;
            if (rx === 1 && rz === 0) edgeColorAt.UR = COLORS[s.color] || COLORS.neutral;
            if (rx === 0 && rz === 1) edgeColorAt.UF = COLORS[s.color] || COLORS.neutral;
            if (rx === -1 && rz === 0) edgeColorAt.UL = COLORS[s.color] || COLORS.neutral;

            if (rx === -1 && rz === -1) (cornerColorAt.UBL || (cornerColorAt.UBL = {}))[ax] = COLORS[s.color] || COLORS.neutral;
            if (rx === 1 && rz === -1) (cornerColorAt.UBR || (cornerColorAt.UBR = {}))[ax] = COLORS[s.color] || COLORS.neutral;
            if (rx === 1 && rz === 1) (cornerColorAt.UFR || (cornerColorAt.UFR = {}))[ax] = COLORS[s.color] || COLORS.neutral;
            if (rx === -1 && rz === 1) (cornerColorAt.UFL || (cornerColorAt.UFL = {}))[ax] = COLORS[s.color] || COLORS.neutral;
          }
        });
      }
    });

    const f2lSlotColors = { F: COLORS.neutral, R: COLORS.neutral };
    cubies.forEach(cubie => {
      const pos = toLocal(cubie.position);
      if (Math.round(pos.x) === 1 && Math.round(pos.z) === 1 && Math.round(pos.y) <= 0) {
        cubie.stickers.forEach(s => {
          const ax = axisOf(toLocal(s.normal));
          if (ax === 'F') f2lSlotColors.F = COLORS[s.color] || COLORS.neutral;
          if (ax === 'R') f2lSlotColors.R = COLORS[s.color] || COLORS.neutral;
        });
      }
    });

    return { uColors, edgeColorAt, cornerColorAt, f2lSlotColors };
  }

  const CELL = 12;
  const INNER = 32;
  const FLAP = 6; // Slim thickness for outer side flaps

  function rect(x, y, w, h, fill) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${COLORS.line}" stroke-width="0.8"/>`;
  }

  function buildSVG(caseData) {
    const alg = caseData && caseData.alg ? caseData.alg : "R U R'";
    let sim;
    try {
      sim = simulateWv(alg);
    } catch (e) {
      sim = { 
        uColors: Array(9).fill(COLORS.neutral), 
        edgeColorAt: {}, 
        cornerColorAt: {},
        f2lSlotColors: { F: COLORS.neutral, R: COLORS.neutral }
      };
      sim.uColors[4] = COLORS.U;
    }

    let svg = '';

    // 1. Center 3x3 U face
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        svg += rect(INNER + col * CELL, INNER + row * CELL, CELL, CELL, sim.uColors[idx]);
      }
    }

    const fallback = COLORS.neutral;
    const ec = sim.edgeColorAt;
    const cc = sim.cornerColorAt;

    // 2. Top row = B face (slim height: FLAP)
    svg += rect(INNER, INNER - FLAP, CELL, FLAP, (cc.UBL && cc.UBL.B) || fallback);
    svg += rect(INNER + CELL, INNER - FLAP, CELL, FLAP, ec.UB || fallback);
    svg += rect(INNER + 2 * CELL, INNER - FLAP, CELL, FLAP, (cc.UBR && cc.UBR.B) || fallback);

    // 3. Bottom row = F face (slim height: FLAP)
    svg += rect(INNER, INNER + 3 * CELL, CELL, FLAP, (cc.UFL && cc.UFL.F) || fallback);
    svg += rect(INNER + CELL, INNER + 3 * CELL, CELL, FLAP, ec.UF || fallback);
    const ufrFColor = (cc.UFR && cc.UFR.F) || sim.f2lSlotColors.F || fallback;
    svg += rect(INNER + 2 * CELL, INNER + 3 * CELL, CELL, FLAP, ufrFColor);

    // 4. Left col = L face (slim width: FLAP)
    svg += rect(INNER - FLAP, INNER, FLAP, CELL, (cc.UBL && cc.UBL.L) || fallback);
    svg += rect(INNER - FLAP, INNER + CELL, FLAP, CELL, ec.UL || fallback);
    svg += rect(INNER - FLAP, INNER + 2 * CELL, FLAP, CELL, (cc.UFL && cc.UFL.L) || fallback);

    // 5. Right col = R face (slim width: FLAP)
    svg += rect(INNER + 3 * CELL, INNER, FLAP, CELL, (cc.UBR && cc.UBR.R) || fallback);
    svg += rect(INNER + 3 * CELL, INNER + CELL, FLAP, CELL, ec.UR || fallback);
    const ufrRColor = (cc.UFR && cc.UFR.R) || sim.f2lSlotColors.R || fallback;
    svg += rect(INNER + 3 * CELL, INNER + 2 * CELL, FLAP, CELL, ufrRColor);

    const name = caseData && caseData.name ? caseData.name : 'WV';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" style="display:block; max-width:88px; max-height:88px; scale: 1.25" role="img" aria-label="${name}, Winter Variation diagram">${svg}</svg>`;
  }

  window.WvSVG = { buildSVG, simulateWv };
  window.WvSvg = window.WvSVG;
})();