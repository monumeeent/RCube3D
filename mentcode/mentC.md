# Project Codebase Registry (`mentcode/mentC.md`)

> **Last Updated:** Date not recorded. Updated from the source and changes discussed in this session.
> **Active Version:** v1.2
> **Registry Status:** Based on files and snippets supplied in this session. The repository and final runtime state have not been independently inspected.
> **Update mentC:** Update this file after project changes.
> **Connected Files:** Before changing a feature, review its connected files so the current logic is understood.
> **File Split:** When a file exceeds roughly 700 lines and contains separate responsibilities, consider splitting it into focused files of about 300-400 lines.

## 1. File Tree

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
│   └── mobile.css
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

**Mobile script note:** There is no `js/mobile.js` or `cfop/mobile.js` in the current supplied tree. Mobile panel behavior is implemented in `js/ui.js`, `cfop/cfop-drawer.js`, and `css/mobile.css`.

## 2. File Connections and Responsibilities

### Application JavaScript

| File | Connected files | Core functions and exports | Responsibility |
| :--- | :--- | :--- | :--- |
| `js/notation.js` | `js/controls.js`, `js/ui.js`, `cfop/cfop-drawer.js`, CFOP renderers, `tests/regression.js` | `normalizeToken()`, `parseAlgorithm()`, `invertToken()`, `invertAlgorithm()`; exports `window.CubeNotation` and `window.CubeNotation.TOKEN` | Shared move-notation parsing, normalization, and inversion. |
| `js/cube.js` | `js/main.js`, `js/controls.js`, `js/ui.js`, `tests/regression.js` | `window.RubiksCube`: `init()`, `executeMove()`, `rebuildCube()`, `isSolved()`, `getStateSnapshot()`, `setTurnDuration()` | Creates and animates Three.js cubies; tracks cube state and X-ray mode. |
| `js/controls.js` | `js/notation.js`, `js/cube.js`, `js/main.js`, `js/hotkeys.js`, `js/ui.js`, `cfop/cfop-drawer.js` | `queueMove()`, `enqueueCubeMoves()`, `takeNextMove()`, `clearMoveQueue()`, `getTurnParameters()`, `undoCubeMove()`, `scrambleCube()`, `resetCube()`, `recordExecutedMove()` and status/history helpers | Move queue, move parameters, undo, scramble, history, and cube-control APIs. |
| `js/main.js` | `index.html`, `js/cube.js`, `js/controls.js`, Three.js and OrbitControls | `init()`, `resizeRenderer()`, `processQueue()`, `setCameraView()`, `getClosestFace()`, `snapCameraToClosestFace()` | Initializes the Three.js scene, camera, renderer, and animation loop. The supplied version observes `#canvas-container` with `ResizeObserver` and updates renderer size and camera aspect when the container changes size. |
| `js/ui.js` | `index.html`, `js/controls.js`, `js/cube.js`, `js/main.js`, `js/notation.js` | Builds the collapsible module wrappers; manages timer, move pad, queue playback, algorithm input, camera presets, quick actions, X-ray, and mobile Menu/Moves panel behavior | Main application UI logic. Mobile navigation uses `#mbb-menu` and `#mbb-movepad` through `setPanel()` and `toggleMobilePanel()`. |
| `js/hotkeys.js` | `js/controls.js`, `js/ui.js` | Private `handleKeyDown()`; calls `queueMove()` and `undoCubeMove()` | Maps keyboard move bindings and Ctrl+Z to cube actions. |
| `js/drag.js` | `index.html`, `.single-control-bar`, `.drawer-tabs` | DOM-ready drag-to-scroll listeners | Adds mouse drag scrolling to selected horizontal controls. |

### CFOP Data, Renderers, and Drawer

| File | Connected files | Core functions and exports | Responsibility |
| :--- | :--- | :--- | :--- |
| `cfop/f2l-oll-data.js` | `index.html`, `cfop/cfop-drawer.js`, CFOP renderers | Defines `window.CFOP_DATA` with F2L and OLL sets | F2L and OLL algorithms grouped into categories and cases. |
| `cfop/pll-data.js` | `index.html`, `cfop/f2l-oll-data.js`, `cfop/cfop-drawer.js` | Defines `window.PLL_DATA`; appends PLL data to `window.CFOP_DATA` when available | PLL algorithms and category groupings. |
| `cfop/wv-data.js` | `index.html`, `cfop/f2l-oll-data.js`, `cfop/cfop-drawer.js` | Defines `window.WV_DATA`; adds WV data to `window.CFOP_DATA` | Winter Variation algorithms and category groupings. |
| `cfop/f2l-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `F2lSVG.buildSVG()`, `buildIsometricDiagram()`, `getInverseReverseAlg()`; exports `window.F2lSVG` and legacy `window.CfopSVG` | Simulates moves and creates isometric F2L case diagrams. |
| `cfop/oll-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `OllSVG.buildOllSVG()`, `simulateOll()`; exports `window.OllSVG` | Simulates inverse OLL algorithms and renders top-down orientation diagrams. |
| `cfop/pll-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `PllSVG.buildPllSVG()`, `simulatePll()`; exports `window.PllSVG` | Simulates PLL permutations and renders top-view diagrams with piece movement arrows. |
| `cfop/wv-renderer.js` | `index.html`, `cfop/cfop-drawer.js`, `js/notation.js` | `WvSVG.buildSVG()`, `simulateWv()`; exports `window.WvSvg` as an alias | Simulates Winter Variation cases and renders top-down diagrams. |
| `cfop/cfop-drawer.js` | `index.html`, CFOP data and renderers, `js/notation.js`, `js/ui.js`, `js/controls.js` | Private `buildDOM()`, `toggleSet()`, `renderDrawer()`, `renderCards()`, `buildCard()`, `loadAndRunAlg()`, `copyAlgorithm()`, `saveState()`, `restoreState()` and collapse-all helpers; dispatches `cfop:ready` and `mobile:sheet-open` | Builds the CFOP rail and drawer; validates algorithms, renders cases, runs and sets up algorithms, copies algorithms, and persists drawer state. Also manages the CFOP mobile button state. |

### Stylesheets, Tests, and Documentation

| File | Connected files | Core responsibility | Purpose |
| :--- | :--- | :--- | :--- |
| `css/style.css` | `index.html`, application UI scripts | Global layout, theme tokens, stage, control panel, timer, move queue, move pad, history, credits | Main application styling. |
| `css/style2.css` | `index.html`, `cfop/cfop-drawer.js`, `css/watermark.css` | CFOP rail, drawer, sections, cards, actions, and brand status styles | Base CFOP library styling. |
| `css/style3.css` | `index.html`, `cfop/cfop-drawer.js`, `css/watermark.css` | CFOP validation and diagram error states | The supplied stylesheet contains CFOP validation/error rules. Verify the working copy before relying on any responsive rules in it. |
| `css/watermark.css` | `index.html`, `cfop/cfop-drawer.js`, `css/style2.css`, `css/style3.css` | `.cfop-watermark-*` rules | Styles the CFOP rail watermark. |
| `css/mobile.css` | `index.html`, `js/ui.js`, `cfop/cfop-drawer.js` | Mobile breakpoint at 860px, bottom navigation, split stage/panel layout, control sheet, CFOP sheet, touch sizing, and mobile-only visibility rules | Loaded after the other stylesheets. Recent changes were proposed to keep the cube visible, constrain the panel to a maximum of 35dvh, compact the Move Pad toolbar, and center the mobile ISO icon. Final local contents and runtime behavior have not been verified. |
| `tests/regression.html` | `tests/regression.js`, application JavaScript, CFOP data and renderers | Standalone browser regression page | Loads the cube engine and CFOP modules for browser tests. |
| `tests/regression.js` | `tests/regression.html`, `js/notation.js`, `js/cube.js`, CFOP data and renderers | `runRegressionTests()` | Tests data parsing, move/inverse identities, double turns, representative algorithms, and invalid renderer inputs. |
| `hotkeys_guide.txt` | `js/hotkeys.js`, `js/ui.js`, `index.html` | User-facing shortcut reference | Documents cube move bindings, timer/camera shortcuts, and sidebar controls. |
| `mentcode/instruct.txt` | CFOP drawer and timer behavior | Operational behavior notes | Summarizes timer and CFOP Run/Setup expectations. |
| `mentcode/ment.md` | Project files and `mentcode/connectDB.md` | Chronological project update log | Records project phases and reported changes. Verify claims against the working tree. |
| `mentcode/connectDB.md` | Project files and tests | Architecture map and workflow notes | Describes project connections, file layout, and verification cautions. |
| `mentcode/mentC.md` | All files listed in this registry | This registry | Codebase reference for file locations, connections, and responsibilities. |

## 3. Script Load Order

The supplied `index.html` loads scripts in this order:

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

CFOP data and renderers must load before `cfop-drawer.js`. The drawer also requires `window.CubeNotation`. There is no mobile JavaScript file in the supplied script list.

## 4. Current Behavior and Verification Notes

### Confirmed from supplied source

- `index.html` includes the mobile bottom navigation buttons `#mbb-cfop`, `#mbb-movepad`, and `#mbb-menu`.
- `index.html` loads `css/mobile.css` after the other stylesheets.
- The mobile breakpoint used by `js/ui.js` and `cfop/cfop-drawer.js` is 860px.
- `#panel` contains the Timer, Move Queue, Algorithm Library, Move Pad, History, and credits modules.
- `js/ui.js` declares `mobileMenuBtn` and `mobileMoveBtn` and uses them in its mobile panel logic. Earlier registry notes claiming these variables were undeclared are superseded.
- `js/main.js` uses `ResizeObserver` on `#canvas-container`. A split layout that changes the stage height should trigger a renderer and camera resize.
- `cfop/cfop-drawer.js` creates `.cfop-root`, `.cfop-sidebar`, the CFOP rail, and `#cfopDrawer` dynamically.
- The latest user-supplied `index.html` contains Timer controls including `#timerMain` and `#timerReset`, and Move Queue controls including `#seqInvert` and `#seqClear`.
- The latest full HTML response supplied a single Move Pad with a shared `.pad-toolbar`, short category labels, and the mobile ISO button inside Quick Actions.

### Mobile design requirements and proposed implementation

- The cube remains visible in an upper stage while the open controls occupy a lower region. The panel should not cover the cube.
- The requested maximum height for the lower panel is 35dvh. The most recent CSS proposal uses content-sized panel height up to this limit to avoid empty space below the Move Pad buttons.
- The Move Pad category tabs and turn-direction controls belong in one `.pad-toolbar`. Proposed short labels are `Face`, `Slice`, `Wide`, and `Rot`, with `CW`, `CCW`, and `2x`.
- The Move Pad collapse control and keyboard hint should be hidden on mobile. The six generated move buttons should fit without unnecessary scrolling when viewport space allows.
- The mobile ISO control is a second button with `id="mobileIsoBtn"` inside `#quick`. The desktop ISO preset remains inside `.cam`. Both use `data-view="iso"` and are selected by the `.cam-btn` query in `js/ui.js`.
- The latest HTML proposal wraps the ISO SVG in `.q-iso-icon-wrap`. A CSS override was supplied to center and size the SVG.
- The mobile ISO toggle behavior requires the corresponding `js/ui.js` change to toggle between ISO and the reset/default camera view and to synchronize `aria-pressed`.
- Reuse the existing inline SVG symbol sprite. No external icon library or new dependency was added.

These are requested/proposed changes, not verified working-tree facts. Confirm that the latest HTML, CSS, and JavaScript edits are applied before treating them as current implementation.

### Debugging and markup corrections discussed

- Earlier runtime errors reported missing `#timerMain`, `#timerReset`, and `#seqClear`. Later user-supplied HTML restored those elements.
- A prior malformed HTML edit placed the Move Pad toolbar inside the Move Queue header. This removed the queue's `#seqInvert` and `#seqClear` controls and caused an `addEventListener` error.
- The corrected structure keeps the queue header and its controls inside `#queue`, and places the single Move Pad section after Algorithm Library.
- IDs such as `#pad`, `#modSeg`, `#pane`, `#tab-outer`, and `#padHint` must appear only once.
- The browser previously returned `null` for required IDs. The final supplied HTML was not tested in a browser, so check the served DOM after applying it. A hard refresh may be needed if the browser has stale markup.
- The earlier report that tapping Moves opened Menu and left the pad visible reflects an older or unverified state. The supplied `js/ui.js` implementation has separate Menu and Moves modes, but browser retesting is still required.
- `tests/regression.html` loads the regression test script but not `cfop/cfop-drawer.js`; those tests do not verify drawer UI behavior.
- No repository inspection, browser run, or regression test execution is claimed.

Useful browser checks after applying the latest HTML:

```js
[
  'timerMain',
  'timerReset',
  'seqClear',
  'seqInvert',
  'seqTrack',
  'modSeg',
  'pane',
  'padHint',
  'mobileIsoBtn'
].map(id => [id, Boolean(document.getElementById(id))]);

document.querySelectorAll('#pad').length;
document.querySelectorAll('#modSeg').length;
document.querySelectorAll('#pane').length;
```

The required elements should be present, and each of the final three counts should be `1`.

## 5. Recent Update Log

### Registry creation

- **Date:** Not recorded.
- **Changed:** Created the initial registry from files and documentation supplied in the session.
- **Verification:** No repository inspection, browser run, or regression tests were performed.

### Mobile navigation and panel behavior

- **Date:** Not recorded.
- **Files discussed:** `index.html`, `css/mobile.css`, `js/ui.js`, `cfop/cfop-drawer.js`.
- **Changes discussed:** Mobile bottom navigation for CFOP, Moves, and Menu; mobile panel visibility states; CFOP button synchronization; responsive sheet styling.
- **Mobile script status:** No `mobile.js` file is present in the current supplied tree or script load order.
- **Verification:** User reported earlier behavior issues. Current browser behavior has not been independently verified.

### Cube and panel split layout

- **Date:** Not recorded.
- **Files discussed:** `css/mobile.css`, `js/main.js`, `cfop/cfop-drawer.js`.
- **Changes discussed:** Keep the cube visible above the open controls instead of allowing a panel to cover it. `main.js` already observes `#canvas-container` with `ResizeObserver`.
- **Panel sizing:** Latest proposal uses an auto-sized lower panel with a maximum height of 35dvh, reducing unused space below the Move Pad.
- **CFOP state:** A `.cfop-open` root class was proposed so the CFOP drawer can occupy the lower layout row. Application of this patch is unconfirmed.
- **Verification:** Not run in a browser.

### Move Pad and mobile ISO updates

- **Date:** Not recorded.
- **Files discussed:** `index.html`, `css/mobile.css`, `js/ui.js`.
- **Changes discussed:** Put category and turn controls in one `.pad-toolbar`, use short labels and existing SVG sprite icons, hide the Move Pad collapse button and keyboard hint on mobile, and add a mobile ISO button to Quick Actions.
- **SVG alignment:** Added `.q-iso-icon-wrap` in the proposed HTML and supplied CSS to center and size its SVG.
- **Camera state:** Supplied a `setView()` update to synchronize ISO active styling and `aria-pressed`; the mobile ISO button toggles between ISO and reset/default view.
- **Verification:** The complete updated HTML was supplied, but its application and browser behavior are unconfirmed.

### Timer and queue markup errors

- **Date:** Not recorded.
- **Issue reported:** `ui.js` threw errors when `#timerMain`, `#timerReset`, and `#seqClear` were missing from the served DOM.
- **Cause identified:** During an earlier markup edit, a standalone timer button and Move Pad markup replaced or displaced required Timer and Move Queue structure. The Move Pad toolbar was also placed inside the Move Queue header.
- **Correction supplied:** Restore the complete Timer module, restore the Move Queue header with `#seqInvert` and `#seqClear`, and keep one Move Pad section after Algorithm Library.
- **Verification:** Later user-supplied HTML contained Timer and Queue controls. The final full HTML proposal has not been confirmed or tested in the working tree.

## 6. Verification Status

- **Filesystem inspection:** Not performed.
- **Browser visual review:** Not performed.
- **JavaScript console verification:** Not performed after the final HTML proposal.
- **Regression tests:** No results available.
- **Claims of completion:** Do not treat proposed changes as applied until the current files are checked and the app is retested.