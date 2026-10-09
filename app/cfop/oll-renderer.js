// cfop/oll-renderer.js
// Files Connected: [index.html, cfop/cfop-drawer.js, cfop/f2l-renderer.js] | Code: JS | Functions: [buildOllSVG]
// Work: OLL Top-View 2D Diagram Generator | Main Purpose: Fixed index alignment for top side indicators
// Last Edit Time: 2026-10-10 00:21:00

'use strict';

(() => {
  const COLOR_U = '#ffd500';               // Yellow Oriented
  const COLOR_MASK = 'var(--s4, #3a3d4a)'; // Grey Unoriented

  function buildOllSVG(algStr) {
    if (!window.F2lSVG || !window.F2lSVG.CubeState) {
      return '';
    }

    const setupAlg = window.F2lSVG.getInverseReverseAlg(algStr);
    const cube = new window.F2lSVG.CubeState();
    cube.applySequence(setupAlg);

    let elements = '';
    const tileSize = 16;
    const gap = 2;
    const offset = 8; // Margin for side bars

    // 1. Render 3x3 Top Grid (U Face)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        const isYellow = cube.faces.U[idx] === 'U';
        const fill = isYellow ? COLOR_U : COLOR_MASK;
        const x = offset + col * (tileSize + gap);
        const y = offset + row * (tileSize + gap);

        elements += `<rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="1" fill="${fill}" stroke="#1e2029" stroke-width="1"></rect>`;
      }
    }

    // 2. Outer Side Bars Rendering

    // TOP SIDE (Back Face) -> [B2 = Top-Left, B1 = Top-Mid, B0 = Top-Right]
    const backIndices = [2, 1, 0];
    for (let col = 0; col < 3; col++) {
      const idx = backIndices[col];
      if (cube.faces.B[idx] === 'U') {
        const x = offset + col * (tileSize + gap);
        elements += `<rect x="${x}" y="1" width="${tileSize}" height="4" rx="1" fill="${COLOR_U}" stroke="#1e2029" stroke-width="0.8"></rect>`;
      }
    }

    // BOTTOM SIDE (Front Face) -> [F0 = Bottom-Left, F1 = Bottom-Mid, F2 = Bottom-Right]
    const frontIndices = [0, 1, 2];
    for (let col = 0; col < 3; col++) {
      const idx = frontIndices[col];
      if (cube.faces.F[idx] === 'U') {
        const x = offset + col * (tileSize + gap);
        elements += `<rect x="${x}" y="61" width="${tileSize}" height="4" rx="1" fill="${COLOR_U}" stroke="#1e2029" stroke-width="0.8"></rect>`;
      }
    }

    // LEFT SIDE (Left Face) -> [L0 = Top-Left, L1 = Mid-Left, L2 = Bottom-Left]
    const leftIndices = [0, 1, 2];
    for (let row = 0; row < 3; row++) {
      const idx = leftIndices[row];
      if (cube.faces.L[idx] === 'U') {
        const y = offset + row * (tileSize + gap);
        elements += `<rect x="1" y="${y}" width="4" height="${tileSize}" rx="1" fill="${COLOR_U}" stroke="#1e2029" stroke-width="0.8"></rect>`;
      }
    }

    // RIGHT SIDE (Right Face) -> [R2 = Top-Right, R1 = Mid-Right, R0 = Bottom-Right]
    const rightIndices = [2, 1, 0];
    for (let row = 0; row < 3; row++) {
      const idx = rightIndices[row];
      if (cube.faces.R[idx] === 'U') {
        const y = offset + row * (tileSize + gap);
        elements += `<rect x="61" y="${y}" width="4" height="${tileSize}" rx="1" fill="${COLOR_U}" stroke="#1e2029" stroke-width="0.8"></rect>`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66" width="100%" height="100%" style="display:block; max-width:64px; max-height:64px;" aria-hidden="true">${elements}</svg>`;
  }

  window.OllSVG = { buildOllSVG };
})();