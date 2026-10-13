// regression.js
// Files Connected: [tests/regression.html, js/notation.js, js/cube.js, cfop/*]
// Code: JavaScript | Functions: [runRegressionTests]
// Work: Browser Regression Tests | Main Purpose: Tests move identities and CFOP data.
// Last Edit Time: Set this timestamp when applying the patch.

(() => {
  'use strict';

  const results = document.getElementById('results');
  const lines = [];
  let passed = 0;
  let failed = 0;

  function record(name, error = null) {
    if (error) {
      failed++;
      lines.push(`FAIL: ${name} — ${error.message || error}`);
    } else {
      passed++;
      lines.push(`PASS: ${name}`);
    }
    results.textContent = lines.join('\n');
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
  }

  async function waitForIdle() {
    while (window.RubiksCube.isAnimating) await nextFrame();
  }

  async function runMoves(tokens) {
    for (const token of tokens) {
      await waitForIdle();
      window.RubiksCube.executeMove(token, window.getTurnParameters);
      await waitForIdle();
    }
  }

  function resetCube() {
    window.RubiksCube.rebuildCube();
  }

  function getCases(set) {
    return (set.subcats || []).flatMap(group => group.cases || []);
  }

  async function runRegressionTests() {
    window.RubiksCube.setTurnDuration(20);

    const bases = [
      'R', 'L', 'U', 'D', 'F', 'B',
      'r', 'l', 'u', 'd', 'f', 'b',
      'Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw',
      'M', 'E', 'S', 'x', 'y', 'z'
    ];

    const dataSets = window.CFOP_DATA;
    assert(dataSets, 'CFOP_DATA did not load.');

    let caseCount = 0;
    for (const [setName, set] of Object.entries(dataSets)) {
      for (const item of getCases(set)) {
        window.CubeNotation.parseAlgorithm(item.alg);
        caseCount++;
      }
      record(`${setName}: parsed every algorithm`);
    }
    record(`Parsed ${caseCount} CFOP algorithms`);

    for (const base of bases) {
      resetCube();
      const solved = window.RubiksCube.getStateSnapshot();

      await runMoves([base]);
      assert(
        window.RubiksCube.getStateSnapshot() !== solved,
        `${base} did not change the cube state.`
      );

      await runMoves([window.CubeNotation.invertToken(base)]);

const afterInverse = window.RubiksCube.getStateSnapshot();
const engineReportsSolved = window.RubiksCube.isSolved();
const snapshotMatches = afterInverse === solved;

assert(
  snapshotMatches,
  `${base} inverse check failed; isSolved=${engineReportsSolved}; snapshotMatches=${snapshotMatches}`
);

      record(`${base} inverse identity`);
    }

    for (const base of bases) {
      resetCube();
      await runMoves([`${base}2`]);
      const doubleTurnState = window.RubiksCube.getStateSnapshot();

      resetCube();
      await runMoves([base, base]);
      const repeatedTurnState = window.RubiksCube.getStateSnapshot();

      assert(
        doubleTurnState === repeatedTurnState,
        `${base}2 differs from ${base} ${base}.`
      );
      record(`${base} double turn`);
    }

    for (const setName of ['f2l', 'oll', 'pll', 'wv']) {
  const set = dataSets[setName];
  assert(set, `Missing CFOP data set: ${setName}.`);

  const item = getCases(set)[0];
  assert(item, `No cases found in ${setName}.`);

  resetCube();
  const solved = window.RubiksCube.getStateSnapshot();
  const alg = window.CubeNotation.parseAlgorithm(item.alg);

  await runMoves(alg);
  await runMoves(
    [...alg].reverse().map(window.CubeNotation.invertToken)
  );

  const afterInverse = window.RubiksCube.getStateSnapshot();

  assert(
    afterInverse === solved,
    `${setName} representative algorithm and inverse did not restore the cube.`
  );

  record(`${setName} representative algorithm inverse`);
}
    const invalidRendererChecks = [
      ['F2L', () => window.F2lSVG.buildSVG({ alg: 'Q' })],
      ['OLL', () => window.OllSVG.buildOllSVG('Q')],
      ['PLL', () => window.PllSVG.buildPllSVG({ alg: 'Q', name: 'Invalid' })],
      ['WV', () => window.WvSVG.buildSVG({ alg: 'Q', name: 'Invalid' })]
    ];

    for (const [name, render] of invalidRendererChecks) {
      let threw = false;
      try {
        render();
      } catch {
        threw = true;
      }
      assert(threw, `${name} renderer did not reject invalid notation.`);
      record(`${name} renderer rejects invalid notation`);
    }

    lines.push(`\nFinished: ${passed} passed, ${failed} failed.`);
    results.textContent = lines.join('\n');
    results.className = failed ? 'fail' : 'pass';
  }

  async function start() {
    try {
      while (!window.RubiksCube || !window.RubiksCube.getStateSnapshot) {
        await nextFrame();
      }
      await waitForIdle();
      await runRegressionTests();
    } catch (error) {
      record('Regression test run', error);
    }
  }

  start();
})();