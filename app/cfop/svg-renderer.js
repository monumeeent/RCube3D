// svg-renderer.js — Dynamic Isometric Setup Simulator

'use strict';

(() => {
  // ── Colors ──────────────────────────────────────────────────────────────
  const COLOR_MAP = {
    U: '#ffd500',               // Top Face (Yellow)
    F: 'var(--face-f, #00d26a)', // Front Face (Green)
    R: 'var(--face-r, #ff4757)', // Right Face (Red)
    L: 'var(--face-l, #ff9f43)', // Left Face (Orange)
    B: 'var(--face-b, #1e90ff)', // Back Face (Blue)
    D: '#ffffff',               // Bottom Face (White)
    N: 'var(--s4, #3a3d4a)'      // Neutral / Masked
  };

  // ── Isometric Projection Points ─────────────────────────────────────────
  // Pre-calculated polygon point coordinates for all 27 visible facelets
  function projectISO(x, y, z, originX = 32, originY = 32, scale = 9.5) {
    const screenX = originX + (x - y) * Math.cos(Math.PI / 6) * scale;
    const screenY = originY + (x + y) * Math.sin(Math.PI / 6) * scale - z * scale;
    return [screenX, screenY];
  }

  // ── Move Inverter Logic ──────────────────────────────────────────────────
  function getInverseReverseAlg(algStr) {
    if (!algStr) return '';
    // Clean notation brackets & trim extra spaces
    const tokens = algStr
      .replace(/[()]/g, '')
      .replace(/[\u2018\u2019]/g, "'")
      .trim()
      .split(/\s+/);

    const inverted = tokens.map(move => {
      if (move.endsWith("'")) return move.slice(0, -1);
      if (move.endsWith("2") || move.endsWith("2'")) return move.replace("2'", "2");
      return move + "'";
    });

    return inverted.reverse().join(' ');
  }

  // ── Virtual Cube State Simulation ───────────────────────────────────────
  class CubeState {
    constructor() {
      this.faces = {
        U: Array(9).fill('U'),
        F: Array(9).fill('F'),
        R: Array(9).fill('R'),
        L: Array(9).fill('L'),
        B: Array(9).fill('B'),
        D: Array(9).fill('D')
      };
    }

    // Rotates a single face 90 degrees Clockwise
    rotateFaceCW(f) {
      const g = this.faces[f];
      this.faces[f] = [g[6], g[3], g[0], g[7], g[4], g[1], g[8], g[5], g[2]];
    }

    // Rotates a single face 90 degrees Counter-Clockwise
    rotateFaceCCW(f) {
      const g = this.faces[f];
      this.faces[f] = [g[2], g[5], g[8], g[1], g[4], g[7], g[0], g[3], g[6]];
    }

    // Applies basic face moves (R, U, F, L, B, D, y, etc.)
    applyMove(m) {
      const base = m.replace(/['2]/g, '');
      const turns = m.includes('2') ? 2 : m.endsWith("'") ? 3 : 1;

      for (let i = 0; i < turns; i++) {
        switch (base) {
          case 'U': {
            this.rotateFaceCW('U');
            const tmp = [...this.faces.F.slice(0, 3)];
            [0, 1, 2].forEach(k => this.faces.F[k] = this.faces.R[k]);
            [0, 1, 2].forEach(k => this.faces.R[k] = this.faces.B[k]);
            [0, 1, 2].forEach(k => this.faces.B[k] = this.faces.L[k]);
            [0, 1, 2].forEach(k => this.faces.L[k] = tmp[k]);
            break;
          }
          case 'R': {
            this.rotateFaceCW('R');
            const tmp = [this.faces.U[2], this.faces.U[5], this.faces.U[8]];
            [2, 5, 8].forEach((k, idx) => this.faces.U[k] = this.faces.F[k]);
            [2, 5, 8].forEach((k, idx) => this.faces.F[k] = this.faces.D[k]);
            [2, 5, 8].forEach((k, idx) => this.faces.D[k] = this.faces.B[8 - k]);
            this.faces.B[6] = tmp[0]; this.faces.B[3] = tmp[1]; this.faces.B[0] = tmp[2];
            break;
          }
          case 'F': {
            this.rotateFaceCW('F');
            const tmp = [this.faces.U[6], this.faces.U[7], this.faces.U[8]];
            this.faces.U[6] = this.faces.L[8]; this.faces.U[7] = this.faces.L[5]; this.faces.U[8] = this.faces.L[2];
            this.faces.L[2] = this.faces.D[0]; this.faces.L[5] = this.faces.D[1]; this.faces.L[8] = this.faces.D[2];
            this.faces.D[0] = this.faces.R[6]; this.faces.D[1] = this.faces.R[3]; this.faces.D[2] = this.faces.R[0];
            this.faces.R[0] = tmp[0]; this.faces.R[3] = tmp[1]; this.faces.R[6] = tmp[2];
            break;
          }
          case 'y': {
            // Whole cube rotation around Y axis
            this.rotateFaceCW('U');
            this.rotateFaceCCW('D');
            const tmpF = [...this.faces.F];
            this.faces.F = [...this.faces.R];
            this.faces.R = [...this.faces.B];
            this.faces.B = [...this.faces.L];
            this.faces.L = tmpF;
            break;
          }
          case 'd': {
            // Wide turn (U and Y rotation)
            this.applyMove('U');
            this.applyMove("y'");
            break;
          }
        }
      }
    }

    // Applies full sequence of move tokens
    applySequence(algStr) {
      if (!algStr) return;
      const tokens = algStr.replace(/[()]/g, '').trim().split(/\s+/);
      tokens.forEach(t => this.applyMove(t));
    }
  }

  // ── Isometric Diagram Generator ──────────────────────────────────────────
  function buildIsometricDiagram(algStr) {
    const cube = new CubeState();
    
    // 1. Calculate inverse reverse setup sequence
    const setupAlg = getInverseReverseAlg(algStr);

    // 2. Run inverse setup sequence on a solved cube state
    cube.applySequence(setupAlg);

    let polygons = '';

    // Render U (Top) Face
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const idx = y * 3 + x;
        const fill = COLOR_MAP[cube.faces.U[idx]] || COLOR_MAP.N;
        const p1 = projectISO(x, y, 3);
        const p2 = projectISO(x + 1, y, 3);
        const p3 = projectISO(x + 1, y + 1, 3);
        const p4 = projectISO(x, y + 1, 3);
        const pts = [p1, p2, p3, p4].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
        polygons += `<polygon points="${pts}" fill="${fill}" stroke="var(--line-strong, #1e2029)" stroke-width="0.8" stroke-linejoin="round"></polygon>`;
      }
    }

    // Render F (Front) Face
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        const idx = (2 - z) * 3 + x;
        const fill = COLOR_MAP[cube.faces.F[idx]] || COLOR_MAP.N;
        const p1 = projectISO(x, 3, z + 1);
        const p2 = projectISO(x + 1, 3, z + 1);
        const p3 = projectISO(x + 1, 3, z);
        const p4 = projectISO(x, 3, z);
        const pts = [p1, p2, p3, p4].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
        polygons += `<polygon points="${pts}" fill="${fill}" stroke="var(--line-strong, #1e2029)" stroke-width="0.8" stroke-linejoin="round"></polygon>`;
      }
    }

    // Render R (Right) Face
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const idx = (2 - z) * 3 + (2 - y);
        const fill = COLOR_MAP[cube.faces.R[idx]] || COLOR_MAP.N;
        const p1 = projectISO(3, y, z + 1);
        const p2 = projectISO(3, y + 1, z + 1);
        const p3 = projectISO(3, y + 1, z);
        const p4 = projectISO(3, y, z);
        const pts = [p1, p2, p3, p4].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
        polygons += `<polygon points="${pts}" fill="${fill}" stroke="var(--line-strong, #1e2029)" stroke-width="0.8" stroke-linejoin="round"></polygon>`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%" style="display:block; max-width:64px; max-height:64px;" aria-hidden="true">${polygons}</svg>`;
  }

  // ── Universal Diagram Entry Point ───────────────────────────────────────
  function buildSVG(caseData) {
    if (!caseData || !caseData.alg) {
      return buildIsometricDiagram("R U R' U'");
    }
    return buildIsometricDiagram(caseData.alg);
  }

  window.CfopSVG = { buildSVG, buildIsometricDiagram, getInverseReverseAlg };
})();