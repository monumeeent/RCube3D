JavaScript connections
File Main responsibility Connections
app / js / notation.js Normalizes, parses, and inverts move notation.Loaded before controls.js, UI consumers, CFOP code, and regression tests.
app / js / cube.js Creates and animates the Three.js cube;
exposes cube state and move execution.Used by main.js, controls.js, and browser regression tests.
app / js / controls.js Parses and queues moves, maintains move history, computes turn parameters, and handles undo / scramble actions.Uses notation.js and cube.js;
called by UI and CFOP actions.
app / js / main.js Initializes the Three.js scene, camera, renderer, and animation loop.Uses cube and move - control functions.
app / js / ui.js Connects timer, playback, camera, move - pad, and panel interactions.Calls move controls and updates application UI.
app / js / hotkeys.js Maps keyboard input to cube actions.Uses application move controls and UI actions.
app / js / drag.js Provides drag - to - scroll behavior for selected UI elements.Used by the application UI.
app / js / move - pad - drawer.js Intended to show the existing Move pad module in the sliding right drawer without displaying a duplicate module.Loaded by index.html;
interacts with .app, .panel, and.stage.Current status: clicking the button reportedly crashes;
investigate before considering this complete.
CFOP connections
File Main responsibility
app / cfop / f2l - oll - data.js F2L and OLL case data.
app / cfop / pll - data.js PLL case data.
app / cfop / wv - data.js WV case data.
app / cfop / f2l - renderer.js Renders F2L case diagrams.
app / cfop / oll - renderer.js Renders OLL case diagrams.
app / cfop / pll - renderer.js Renders PLL case diagrams.
app / cfop / wv - renderer.js Renders WV case diagrams.
app / cfop / cfop - drawer.js Builds the CFOP library UI and connects case actions to renderers and move controls.
CFOP datasets and renderers must load before cfop - drawer.js.Move notation validation should use the shared window.CubeNotation parser.

CSS connections
File Main responsibility
app / css / style.css Global tokens, application layout, cube stage, timer, controls, panel, and general responsive styles.
app / css / style2.css Base CFOP library styling:
rail, drawer, case cards, and brand status.
app / css / watermark.css CFOP watermark appearance.It should not force the rail’s layout in a way that overrides mobile navigation.
app / css / style3.css CFOP validation / error states and mobile CFOP layout.Also contains the Move pad drawer button styling if enabled.
Load style3.css after the other application styles so its mobile overrides are applied last.Avoid duplicate rail and drawer layout rules across stylesheets.

Regression tests and documentation
File Main responsibility
app / tests / regression.html Browser test page loading the cube engine, notation, and CFOP data / renderers.
app / tests / regression.js Tests move identities, double turns, dataset parsing, and invalid renderer inputs.
app / hotkeys_guide.txt User - facing keyboard shortcut guide.
mentcode / instruct.txt Operational instructions and development workflow.
mentcode / ment.md Project change log.Record only changes and tests actually completed.
mentcode / connectDB.md This architecture and routing map.
README.md Project overview and usage information.
2.File Categorization
Browser application
HTML entry point:
app / index.html
JavaScript:
app / js /
CFOP data, renderers, and drawer:
app / cfop /
CSS:
app / css /
Browser regression checks:
app / tests /
User shortcut guide:
app / hotkeys_guide.txt
Project documentation
README.md
mentcode / connectDB.md
mentcode / instruct.txt
mentcode / ment.md
Automation and repository files
.github / workflows / main.yml:
GitHub Actions workflow.
git:
a tracked root - level file shown by git ls - files;
verify what it contains before documenting its purpose.
.git / : local Git metadata;
not application source and not part of the deployment tree.
3.Project File Tree Structure
This tree is based on the git ls - files output supplied by the project owner.

RCube3D /
├──.github /
│ └── workflows /
│ └── main.yml
├── README.md
├── git
├── app /
│ ├── index.html
│ ├── hotkeys_guide.txt
│ ├── cfop /
│ │ ├── cfop - drawer.js
│ │ ├── f2l - oll - data.js
│ │ ├── f2l - renderer.js
│ │ ├── oll - renderer.js
│ │ ├── pll - data.js
│ │ ├── pll - renderer.js
│ │ ├── wv - data.js
│ │ └── wv - renderer.js
│ ├── css /
│ │ ├── style.css
│ │ ├── style2.css
│ │ ├── style3.css
│ │ └── watermark.css
│ ├── js /
│ │ ├── controls.js
│ │ ├── cube.js
│ │ ├── drag.js
│ │ ├── hotkeys.js
│ │ ├── main.js
│ │ ├── move - pad - drawer.js
│ │ ├── notation.js
│ │ └── ui.js
│ └── tests /
│ ├── regression.html
│ └── regression.js
└── mentcode /
├── connectDB.md
├── instruct.txt
└── ment.md
The.git / directory is intentionally not shown as a project source directory.

4.Phases Log
Phase 1 — Repository structure review
Reviewed the tracked file list supplied by the project owner.
Confirmed that the tracked CFOP files use the f2l - oll - data.js, pll - data.js, and wv - data.js naming.
Confirmed that the project documentation is under mentcode / .
Runtime path verification is separate from the tracked - file - list check.
Phase 2 — Shared notation and regression test work
Added app / js / notation.js and browser regression test files according to the supplied change plan.
Corrected a notation - regex mismatch identified during inverse - move testing.
The project owner reported that the regression tests no longer failed after the test - loop correction.
Final complete test output was not recorded in this map;
do
    not treat it as a formal test report.
    Phase 3 — CFOP rendering and error handling
    Planned shared notation validation and visible error states for malformed algorithms.
    Renderer changes should be considered complete only after confirming the edits in the working tree and testing the CFOP drawer.
    Phase 4 — Responsive CFOP styling
    Added style3.css to the supplied project tree.
    Consolidated CFOP styling into style2.css and moved CFOP mobile and error - state styling into style3.css according to the supplied changes.
    A mobile rail layout conflict with a forced vertical.cfop - rail rule in watermark.css was identified.Verify that the conflicting rule has been removed.
    Phase 5 — Move pad drawer
    Added move - pad - drawer.js to the supplied project tree.
    Intended behavior: use the existing right sidebar drawer and show only the Move pad module in that mode, without leaving a second Move pad module in the normal sidebar.
    Unresolved: the project owner reports the app crashes after clicking the Move pad button.Capture the first browser Console error and fix the cause before marking this phase complete.
    Documentation and verification rule
    Update this log after changes are applied and tested.Record exact files changed, the test command or manual checks performed, and their actual results.Do not mark planned or unverified changes as completed.
