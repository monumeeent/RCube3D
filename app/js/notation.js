// notation.js
// Files Connected: [index.html, controls.js, ui.js, cfop/cfop-drawer.js, tests/regression.js]
// Code: JavaScript | Functions: [normalizeToken, parseAlgorithm, invertToken, invertAlgorithm]
// Work: Shared Move Notation | Main Purpose: Provides one parser and inverter for cube moves.
// Last Edit Time: Enter the actual save time in the project's agreed timezone.

(() => {
  'use strict';

  const TOKEN =
    /^(Rw|Lw|Uw|Dw|Fw|Bw|[RLUDFBrludfbMESxyz])(2|')?$/;

  const TOKEN_WITH_LEGACY_SUFFIX =
    /^(Rw|Lw|Uw|Dw|Fw|Bw|[RLUDFBrludfbMESxyz])(?:2'|'2|2|')?$/;

  function normalizeToken(value) {
    if (typeof value !== 'string') {
      throw new Error('Move must be text.');
    }

    const token = value
      .replace(/[\u2018\u2019\u2032]/g, "'")
      .trim();

    const match = TOKEN_WITH_LEGACY_SUFFIX.exec(token);
    if (!match) {
      throw new Error(`Invalid move: "${token}".`);
    }

    const suffix = token.slice(match[1].length);
    const normalizedSuffix = suffix.includes('2') ? '2' : suffix;

    return match[1] + normalizedSuffix;
  }

  function parseAlgorithm(value, maxMoves = 2000) {
    if (typeof value !== 'string') {
      throw new Error('Algorithm must be text.');
    }

    const text = value
      .replace(/[\u2018\u2019\u2032]/g, "'")
      .replace(/[()[\],]/g, ' ')
      .trim();

    if (!text) {
      throw new Error('Enter at least one move.');
    }

    const rawTokens = text.split(/\s+/);
    if (rawTokens.length > maxMoves) {
      throw new Error(`Sequences are limited to ${maxMoves} moves.`);
    }

    return rawTokens.map((token, index) => {
      try {
        return normalizeToken(token);
      } catch {
        throw new Error(`Invalid move "${token}" at step ${index + 1}.`);
      }
    });
  }

  function invertToken(token) {
    const normalized = normalizeToken(token);

    if (normalized.endsWith('2')) return normalized;
    if (normalized.endsWith("'")) return normalized.slice(0, -1);
    return `${normalized}'`;
  }

  function invertAlgorithm(value) {
    return parseAlgorithm(value)
      .reverse()
      .map(invertToken)
      .join(' ');
  }

  window.CubeNotation = Object.freeze({
    TOKEN,
    normalizeToken,
    parseAlgorithm,
    invertToken,
    invertAlgorithm
  });
})();