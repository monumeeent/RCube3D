# Project Codebase Registry (`mentcode/mentC.md`)
> **Last Updated:** Not recorded — compiled from the files supplied in this session  
> **Active Version:** v1.0  
> **Registry Status:** Source snapshot documented; filesystem and runtime behavior not independently verified.
> **Update mentC:** If You Read This File Dont Forget to Update This File After Some Activity Accrodingly.
> **Asking Files:** If You Are Going for any change or Update . Ask for the files connected to it first . So you understand the recent Logic .
> **File Split:** If any File is getting much line and longer(700lines) and has different purposes . Split Them into separate file accrodingly(300-400 LInes)

## 🌳 1. File Tree & Directory Structure

```text
RCube3D/
├── index.html
├── hotkeys_guide.txt
│
├── css/
│   ├── style.css
│   ├── style2.css
│   ├── style3.css
│   ├── watermark.css
│   └── mobile.css       ← Mobile bottom bar, responsive layout, sheet styling
│ 
├── js/
│   ├── notation.js
│   ├── cube.js
│   ├── controls.js
│   ├── hotkeys.js
│   ├── drag.js
│   ├── main.js
│   └── ui.js
│   
│
├── cfop/
│   ├── f2l-oll-data.js
│   ├── pll-data.js
│   ├── wv-data.js
│   ├── f2l-renderer.js
│   ├── pll-renderer.js
│   ├── oll-renderer.js
│   ├── wv-renderer.js
│   └── cfop-drawer.js
│
├── tests/
│   ├── regression.html
│   └── regression.js
│
└── mentcode/
    ├── instruct.txt
    ├── ment.md
    ├── connectDB.md
    └── mentC.md
```

## 🔗 2. File Connections & Function Map

### Application JavaScript

| File Path & Name | Connected Files | Core Functions / Exports | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `js/notation.js` | `js/controls.js`, `js/ui.js`, `cfop/cfop-drawer.js`, CFOP renderers, `tests/regression.js` | `normalizeToken()`, `parseAlgorithm()`, `invertToken()`, `invertAlgorithm()`; exports `window.CubeNotation` and `window.CubeNotation.TOKEN` | Shared move notation parser, normalizer, and inverter. |
| `js/cube.js` | `js/main.js`, `js/controls.js`, `js/ui.js`, `tests/regression.js` | `window.RubiksCube`: `init()`, `executeMove()`, `rebuildCube()`, `isSolved()`, `getStateSnapshot()`, `setTurnDuration()` | Creates and animates Three.js cube cubies; tracks cube state and X-ray mode. |
| `js/controls.js` | `js/notation.js`, `js/cube.js`, `js/main.js`, `js/hotkeys.js`, `js/ui.js`, `cfop/cfop-drawer.js` | Exports `queueMove()`, `enqueueCubeMoves()`, `takeNextMove()`, `clearMoveQueue()`, `getTurnParameters()`, `undoCubeMove()`, `scrambleCube()`, `resetCube()`, `recordExecutedMove()` and status/history helpers | Move queue, move parameters, undo, scramble, history, and cube-control APIs. |
| `js/main.js` | `index.html`, `js/cube.js`, `js/controls.js`, Three.js and OrbitControls | `init()`, `resizeRenderer()`, `processQueue()`, `setCameraView()`, `getClosestFace()`, `snapCameraToClosestFace()` | Initializes the Three.js scene and camera, runs the render/move loop, and exposes cube status and camera helpers. |
| `js/ui.js` | `index.html`, `js/controls.js`, `js/cube.js`, `js/main.js`, `js/notation.js` | Builds and manages the control-panel UI, move pad, timer, sequence playback, algorithm input, camera presets, quick actions, X-ray mode, and mobile Menu/Moves panel behavior. || `js/hotkeys.js` | `js/controls.js`, `js/ui.js` | Private `handleKeyDown()`; calls `queueMove()` and `undoCubeMove()` | Maps keyboard move bindings and Ctrl+Z to cube actions. |
| `js/drag.js` | `index.html`, `.single-control-bar`, `.drawer-tabs` | DOM-ready drag-to-scroll listeners | Adds mouse drag scrolling to selected horizontal controls. |

### CFOP Data, Renderers, and Drawer

| File Path & Name | Connected Files | Core Functions / Exports | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `cfop/f2l-oll-data.js` | `index.html`, `cfop/cfop-drawer.js`, CFOP renderers | Defines `window.CFOP_DATA` with `f2l` and `oll` sets | F2L and OLL algorithms grouped into categories and cases. |
| `cfop/pll-data.js` | `index.html`, `cfop/f2l-oll-data.js`, `cfop/cfop-drawer.js` | Defines `window.PLL_DATA`; appends it to `window.CFOP_DATA.pll` when master data exists | PLL algorithms and their category groupings. |
| `cfop/wv-data.js` | `index.html`, `cfop/f2l-oll-data.js`, `cfop/cfop-drawer.js` | Defines `window.WV_DATA`; adds it to `window.CFOP_DATA.wv` | Winter Variation algorithms and their category groupings. |
| `cfop/f2l-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `F2lSVG.buildSVG()`, `buildIsometricDiagram()`, `getInverseReverseAlg()`; exports `window.F2lSVG` and legacy `window.CfopSVG` | Simulates moves and creates isometric F2L case diagrams. |
| `cfop/oll-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `OllSVG.buildOllSVG()`, `simulateOll()`; exports `window.OllSVG` | Simulates the inverse of OLL algorithms to render top-down orientation diagrams. |
| `cfop/pll-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `PllSVG.buildPllSVG()`, `simulatePll()`; exports `window.PllSVG` | Simulates PLL permutations and renders a top-view diagram with piece movement arrows. |
| `cfop/wv-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `WvSVG.buildSVG()`, `simulateWv()`; also exports `window.WvSvg` as an alias | Simulates Winter Variation cases and renders a top-down diagram with surrounding stickers. |
| `cfop/cfop-drawer.js` | `index.html`, all CFOP data and renderers, `js/notation.js`, `js/ui.js`, `js/controls.js` | Private `buildDOM()`, `toggleSet()`, `renderDrawer()`, `renderCards()`, `buildCard()`, `loadAndRunAlg()`, `copyAlgorithm()`, `saveState()`, `restoreState()`, setCollapseAllState(), syncCollapseAllButton(), bindCollapseAllSync(); renderDrawer() updated. Dispatches 'cfop:ready' . | Builds the left CFOP navigation rail and case drawer; validates algorithms, renders cases, runs/setup algorithms, copies algorithms, and persists drawer state. |


### Stylesheets, Tests, and Documentation

| File Path & Name | Connected Files | Core Responsibility | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `css/style.css` | `index.html`, application UI scripts | Global layout, theme tokens, stage, control panel, timer, move queue, move pad, history, and credits | Main application styling. |
| `css/style2.css` | `index.html`, `cfop/cfop-drawer.js`, `css/watermark.css` | CFOP root, rail, drawer, sections, cards, actions, and brand status styles | Base CFOP drawer and library styling. |
| `css/style3.css` | `index.html`, `cfop/cfop-drawer.js`, `css/watermark.css` | CFOP validation/error and mobile navigation/drawer styles | Responsive CFOP styling and card error presentation. |
| `css/watermark.css` | `index.html`, `cfop/cfop-drawer.js`, `css/style2.css`, `css/style3.css` | `.cfop-watermark-*` rules | Styles the rail watermark. |
| `css/mobile.css` | `index.html`, `js/ui.js`, `cfop/cfop-drawer.js` | Mobile breakpoint (≤860px), bottom bar, control-panel sheet, CFOP sheet, touch sizing, and mobile panel visibility rules. Loaded after the other stylesheets. |
| `tests/regression.html` | `tests/regression.js`, application JavaScript, CFOP data and renderers | Standalone browser regression-test page | Loads the cube engine and CFOP modules for browser tests. |
| `tests/regression.js` | `tests/regression.html`, `js/notation.js`, `js/cube.js`, CFOP data and renderers | `runRegressionTests()` | Tests data parsing, move/inverse identities, double turns, representative algorithms, and invalid renderer inputs. |
| `hotkeys_guide.txt` | `js/hotkeys.js`, `js/ui.js`, `index.html` | User-facing shortcut reference | Documents cube move bindings, timer/camera shortcuts, and sidebar controls. |
| `mentcode/instruct.txt` | CFOP drawer and timer behavior | Operational behavior notes | Summarizes timer and CFOP Run/Setup expectations. |
| `mentcode/ment.md` | Project files and `mentcode/connectDB.md` | Chronological project update log | Records project phases and reported changes; verify claims against the working tree before treating them as completed. |
| `mentcode/connectDB.md` | Project files and tests | Architecture map and workflow notes | Describes project connections, file layout, and verification cautions. |
| `mentcode/mentC.md` | All files listed in this registry | This registry | Codebase reference for file locations, connections, and responsibilities. |

## 📦 3. Script Load Order

The supplied `index.html` loads application scripts in this order:

1. `js/notation.js`
2. `js/cube.js`
3. `js/controls.js`
4. `js/hotkeys.js`
5. `js/drag.js`
6. `js/main.js`
7. `js/ui.js`
8. `cfop/f2l-oll-data.js`
9. `cfop/pll-data.js`
10. `cfop/wv-data.js`
11. `cfop/f2l-renderer.js`
12. `cfop/pll-renderer.js`
13. `cfop/oll-renderer.js`
14. `cfop/wv-renderer.js`
15. `cfop/cfop-drawer.js`


CFOP data and renderers must be available before `cfop-drawer.js` initializes. The drawer also requires `window.CubeNotation`.

## 🗒️ 4. Current Behavior & Verification Notes

- The CFOP rail is generated from `window.CFOP_DATA`; the supplied datasets include F2L, OLL, PLL, and WV.
- The drawer supports category selection, accordion sections, collapse/expand all, case diagrams, Run, Setup, Copy, and local-storage restoration.
- The drawer’s `[` shortcut toggles the drawer when a set is active; Escape closes it.
- The application’s `\` shortcut toggles the controls panel. This is distinct from the CFOP drawer shortcut.
- `tests/regression.html` loads the regression test script but does not load `cfop/cfop-drawer.js`; the supplied regression tests therefore do not verify drawer UI behavior.
- In the supplied `css/style3.css` content, mobile layout rules are shown without a visible enclosing `@media` rule. Confirm the actual stylesheet before relying on those rules being mobile-only.
- The supplied contents were not run or checked against a repository working tree. No test results are asserted here.
- css/style3.css contains only CFOP validation rules. No mobile rules are present in the supplied content.
- Mobile breakpoint is 860px across ui.js, cfop-drawer.js, and mobile.css.
- style.css header lists @media blocks, but the supplied content contains none. Confirm before relying on mobile.css overrides.
- `index.html` loads `css/mobile.css` after `style3.css` and contains the mobile bottom bar with `#mbb-cfop`, `#mbb-movepad`, and `#mbb-menu`.
- The Move Pad is `#pad`, a direct child of the controls panel `#panel`. The mobile stylesheet supplied so far hides non-pad content in Moves mode, but does not include the Menu-mode rule to hide `#pad`.
- In the latest supplied `js/ui.js`, `mobileMenuBtn` and `mobileMoveBtn` are referenced but are not declared. The source also contains an unused `showPanelModule()` helper. The proposed correction has not been confirmed as applied.
- Reported mobile behavior: CFOP opens and closes correctly; Moves opens the Move Pad, but tapping Moves again opens Menu; the Move Pad also remains visible in Menu. These issues are unresolved.
- The supplied `cfop-drawer.js` dynamically creates `#cfopDrawer` and its controls. The earlier selector `#cfopDrawerHead .cfop-collapse-all-btn` only exists after rendering a CFOP set; the supplied console result showed the Collapse All control and six section toggles after selecting F2L.
- `MobileNav.diagnose()` is not a supported console command: no `MobileNav` global is defined in the supplied code.
- The supplied source and reported live behavior may differ. No browser run or independent filesystem inspection has been performed.


## 🔄 5. Recent Update Log

### Registry creation — date not recorded
- **Changed:** Created this registry content from the code and documentation supplied in the session.
- **Scope:** Documented the supplied project tree, script order, file connections, exported APIs, and major responsibilities.
- **Verification:** No repository inspection, browser run, or regression-test execution was performed. No application changes or test results are claimed.
### Mobile navigation — code applied (proposed v1.1)
- Changed: css/mobile.css (replaced), cfop-drawer.js (renderDrawer + 3 helpers), index.html (bottom bar markup, script tag).
- Corrected from earlier plan: real IDs (#panel, #pad, .cfop-sidebar), 860px breakpoint, drag.js and main.js need no changes, style3.css has no mobile rules.
- Verification: not run in a browser. No test results claimed. Date not recorded.
### Mobile navigation and Move Pad follow-up — date not recorded
- **Source reviewed:** User-supplied `index.html`, `js/ui.js`, `cfop/cfop-drawer.js`, and `css/mobile.css` excerpts.
- **Confirmed from supplied source:** The mobile bar has CFOP, Moves, and Menu buttons; `mobile.css` is loaded last; the breakpoint is 860px; the Move Pad is `#pad` inside `#panel`.
- **Reported by user:** CFOP toggle works. Moves opens the Move Pad, but toggling Moves again opens Menu. The Move Pad is still visible in Menu.
- **Issue found in supplied `ui.js`:** `mobileMenuBtn` and `mobileMoveBtn` are referenced without declarations; `showPanelModule()` remains unused.
- **Issue found in supplied `mobile.css`:** The Menu-mode rule hiding `#pad` is missing.
- **Status:** Corrective code was provided, but application and verification are not confirmed. Do not mark the mobile Menu/Moves behavior as fixed until retested.
- **Verification:** Not run. No claim of regression or browser tests passing.