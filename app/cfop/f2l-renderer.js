// cfop/f2l-renderer.js
// Files Connected: [index.html, cfop/cfop-drawer.js, cfop/oll-renderer.js] | Code: JS
// Work: F2L Modular Isometric Renderer | Main Purpose: Generates 3D Isometric SVG previews for F2L cases

'use strict';

(() => {
  const COLOR_MAP = {
    U: '#ffd500',
    F: 'var(--face-f, #00d26a)',
    R: 'var(--face-r, #ff4757)',
    L: 'var(--face-l, #ff9f43)',
    B: 'var(--face-b, #1e90ff)',
    D: '#ffffff',
    N: 'var(--s4, #3a3d4a)'
  };

  function projectISO(x, y, z, originX = 32, originY = 32, scale = 9.5) {
    const screenX = originX + (x - y) * Math.cos(Math.PI / 6) * scale;
    const screenY = originY + (x + y) * Math.sin(Math.PI / 6) * scale - z * scale;
    return [screenX, screenY];
  }

  function getInverseReverseAlg(algStr) {
    if (!algStr) return '';
    const tokens = algStr
      .replace(/[()[\]]/g, '')
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

    rotateFaceCW(f) {
      const g = this.faces[f];
      this.faces[f] = [g[6], g[3], g[0], g[7], g[4], g[1], g[8], g[5], g[2]];
    }

    rotateFaceCCW(f) {
      const g = this.faces[f];
      this.faces[f] = [g[2], g[5], g[8], g[1], g[4], g[7], g[0], g[3], g[6]];
    }

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
          case 'D': {
            this.rotateFaceCW('D');
            const tmp = [...this.faces.F.slice(6, 9)];
            [6, 7, 8].forEach(k => this.faces.F[k] = this.faces.L[k]);
            [6, 7, 8].forEach(k => this.faces.L[k] = this.faces.B[k]);
            [6, 7, 8].forEach(k => this.faces.B[k] = this.faces.R[k]);
            [6, 7, 8].forEach(k => this.faces.R[k] = tmp[k - 6]);
            break;
          }
          case 'R': {
            this.rotateFaceCW('R');
            const tmp = [this.faces.U[2], this.faces.U[5], this.faces.U[8]];
            this.faces.U[2] = this.faces.F[2]; this.faces.U[5] = this.faces.F[5]; this.faces.U[8] = this.faces.F[8];
            this.faces.F[2] = this.faces.D[2]; this.faces.F[5] = this.faces.D[5]; this.faces.F[8] = this.faces.D[8];
            this.faces.D[2] = this.faces.B[6]; this.faces.D[5] = this.faces.B[3]; this.faces.D[8] = this.faces.B[0];
            this.faces.B[6] = tmp[0];          this.faces.B[3] = tmp[1];          this.faces.B[0] = tmp[2];
            break;
          }
          case 'L': {
            this.rotateFaceCW('L');
            const tmp = [this.faces.U[0], this.faces.U[3], this.faces.U[6]];
            this.faces.U[0] = this.faces.B[8]; this.faces.U[3] = this.faces.B[5]; this.faces.U[6] = this.faces.B[2];
            this.faces.B[8] = this.faces.D[0]; this.faces.B[5] = this.faces.D[3]; this.faces.B[2] = this.faces.D[6];
            this.faces.D[0] = this.faces.F[0]; this.faces.D[3] = this.faces.F[3]; this.faces.D[6] = this.faces.F[6];
            this.faces.F[0] = tmp[0];          this.faces.F[3] = tmp[1];          this.faces.F[6] = tmp[2];
            break;
          }
          case 'F': {
            this.rotateFaceCW('F');
            const tmp = [this.faces.U[6], this.faces.U[7], this.faces.U[8]];
            this.faces.U[6] = this.faces.L[8]; this.faces.U[7] = this.faces.L[5]; this.faces.U[8] = this.faces.L[2];
            this.faces.L[2] = this.faces.D[0]; this.faces.L[5] = this.faces.D[1]; this.faces.L[8] = this.faces.D[2];
            this.faces.D[0] = this.faces.R[6]; this.faces.D[1] = this.faces.R[3]; this.faces.D[2] = this.faces.R[0];
            this.faces.R[0] = tmp[0];          this.faces.R[3] = tmp[1];          this.faces.R[6] = tmp[2];
            break;
          }
          case 'B': {
            this.rotateFaceCW('B');
            const tmp = [this.faces.U[0], this.faces.U[1], this.faces.U[2]];
            this.faces.U[0] = this.faces.R[2]; this.faces.U[1] = this.faces.R[5]; this.faces.U[2] = this.faces.R[8];
            this.faces.R[2] = this.faces.D[8]; this.faces.R[5] = this.faces.D[7]; this.faces.R[8] = this.faces.D[6];
            this.faces.D[6] = this.faces.L[0]; this.faces.D[7] = this.faces.L[3]; this.faces.D[8] = this.faces.L[6];
            this.faces.L[0] = tmp[2];          this.faces.L[3] = tmp[1];          this.faces.L[6] = tmp[0];
            break;
          }
          case 'M': {
            const tmpU = [this.faces.U[1], this.faces.U[4], this.faces.U[7]];
            this.faces.U[1] = this.faces.B[7]; this.faces.U[4] = this.faces.B[4]; this.faces.U[7] = this.faces.B[1];
            this.faces.B[7] = this.faces.D[1]; this.faces.B[4] = this.faces.D[4]; this.faces.B[1] = this.faces.D[7];
            this.faces.D[1] = this.faces.F[1]; this.faces.D[4] = this.faces.F[4]; this.faces.D[7] = this.faces.F[7];
            this.faces.F[1] = tmpU[0];          this.faces.F[4] = tmpU[1];          this.faces.F[7] = tmpU[2];
            break;
          }
          case 'E': {
            const tmpF = [this.faces.F[3], this.faces.F[4], this.faces.F[5]];
            [3, 4, 5].forEach(k => this.faces.F[k] = this.faces.L[k]);
            [3, 4, 5].forEach(k => this.faces.L[k] = this.faces.B[k]);
            [3, 4, 5].forEach(k => this.faces.B[k] = this.faces.R[k]);
            [3, 4, 5].forEach(k => this.faces.R[k] = tmpF[k - 3]);
            break;
          }
          case 'S': {
            const tmpU = [this.faces.U[3], this.faces.U[4], this.faces.U[5]];
            this.faces.U[3] = this.faces.L[7]; this.faces.U[4] = this.faces.L[4]; this.faces.U[5] = this.faces.L[1];
            this.faces.L[1] = this.faces.D[3]; this.faces.L[4] = this.faces.D[4]; this.faces.L[7] = this.faces.D[5];
            this.faces.D[3] = this.faces.R[7]; this.faces.D[4] = this.faces.R[4]; this.faces.D[5] = this.faces.R[1];
            this.faces.R[1] = tmpU[2];          this.faces.R[4] = tmpU[1];          this.faces.R[7] = tmpU[0];
            break;
          }
          case 'r': { this.applyMove('R'); this.applyMove("M'"); break; }
          case 'l': { this.applyMove('L'); this.applyMove('M'); break; }
          case 'u': { this.applyMove('U'); this.applyMove("E'"); break; }
          case 'd': { this.applyMove('D'); this.applyMove('E'); break; }
          case 'f': { this.applyMove('F'); this.applyMove('S'); break; }
          case 'b': { this.applyMove('B'); this.applyMove("S'"); break; }
          case 'y': {
            this.rotateFaceCW('U');
            this.rotateFaceCCW('D');
            const tmpF = [...this.faces.F];
            this.faces.F = [...this.faces.R];
            this.faces.R = [...this.faces.B];
            this.faces.B = [...this.faces.L];
            this.faces.L = tmpF;
            break;
          }
          case 'x': {
            this.applyMove('R');
            this.applyMove("M'");
            this.applyMove("L'");
            break;
          }
        }
      }
    }

    applySequence(algStr) {
      if (!algStr) return;
      const tokens = algStr.replace(/[()[\]]/g, '').trim().split(/\s+/);
      tokens.forEach(t => this.applyMove(t));
    }
  }

  function buildIsometricDiagram(algStr) {
    const cube = new CubeState();
    const setupAlg = getInverseReverseAlg(algStr);
    cube.applySequence(setupAlg);

    let polygons = '';

    // Render U Face
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const idx = y * 3 + x;
        const fill = COLOR_MAP[cube.faces.U[idx]] || COLOR_MAP.U;
        const p1 = projectISO(x, y, 3);
        const p2 = projectISO(x + 1, y, 3);
        const p3 = projectISO(x + 1, y + 1, 3);
        const p4 = projectISO(x, y + 1, 3);
        const pts = [p1, p2, p3, p4].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
        polygons += `<polygon points="${pts}" fill="${fill}" stroke="var(--line-strong, #1e2029)" stroke-width="0.8" stroke-linejoin="round"></polygon>`;
      }
    }

    // Render F Face
    for (let x = 0; x < 3; x++) {
      for (let z = 0; z < 3; z++) {
        const idx = (2 - z) * 3 + x;
        const fill = COLOR_MAP[cube.faces.F[idx]] || COLOR_MAP.F;
        const p1 = projectISO(x, 3, z + 1);
        const p2 = projectISO(x + 1, 3, z + 1);
        const p3 = projectISO(x + 1, 3, z);
        const p4 = projectISO(x, 3, z);
        const pts = [p1, p2, p3, p4].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
        polygons += `<polygon points="${pts}" fill="${fill}" stroke="var(--line-strong, #1e2029)" stroke-width="0.8" stroke-linejoin="round"></polygon>`;
      }
    }

    // Render R Face
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const idx = (2 - z) * 3 + (2 - y);
        const fill = COLOR_MAP[cube.faces.R[idx]] || COLOR_MAP.R;
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

  function buildSVG(caseData) {
    return buildIsometricDiagram(caseData ? caseData.alg : "R U R' U'");
  }

  window.F2lSVG = { buildSVG, buildIsometricDiagram, getInverseReverseAlg, CubeState };
  window.CfopSVG = window.F2lSVG; // Backward compatibility fallback
})();