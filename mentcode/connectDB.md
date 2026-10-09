// filename: connectDB.md
// Files Connected: [index.html, ment.md, instruct.txt] | Code: Markdown | Sections: [System Architecture Map]
// Work: System Routing & File Map | Main Purpose: Tracks dependencies, file structure, and categorization
// Last Edit Time: 2026-10-10 00:56:00

# System Architecture Map (`ConnectDB.md`)

## 1. Connected Files & Routing
- `index.html` → Imports Three.js, OrbitControls, stylesheets (`style.css`, `style2.css`, `watermark.css`), core logic scripts, and CFOP drawer scripts[cite: 2].
- `js/main.js` → Initializes Three.js WebGL canvas, lighting, camera controls, and animation loop[cite: 7].
- `js/cube.js` → Exports `window.RubiksCube` for mesh building, slice turns, and solved checks[cite: 4].
- `js/controls.js` → Manages move execution queues, relative move vector math, undo history, and scramble generation[cite: 9].
- `js/hotkeys.js` → Listens for keyboard inputs and maps them to move queue actions[cite: 6].
- `js/ui.js` → Manages control panel collapse states, speed dial, timer/inspection state machine, and Move Pad key lighting[cite: 8].
- `cfop/cfop-drawer.js` → Reads `CFOP_DATA` from `cfop-data.js`, renders previews via `f2l-renderer.js` and `oll-renderer.js`, and sends execution triggers to `controls.js`.

---

## 2. File Categorization
- **Core Engine:** `js/main.js`, `js/cube.js`[cite: 4, 7]
- **Controls & Logic:** `js/controls.js`, `js/hotkeys.js`, `js/drag.js`[cite: 5, 6, 9]
- **UI & Panels:** `js/ui.js`, `css/style.css`, `css/style2.css`, `css/watermark.css`[cite: 2, 8]
- **CFOP Modules:** `cfop/cfop-data.js`, `cfop/f2l-renderer.js`, `cfop/oll-renderer.js`, `cfop/cfop-drawer.js`[cite: 10, 11, 12, 13]

---

## 3. Project File Tree Structure
```text
RCube3D
│   README.md
│   hotkeys_guide.txt
│
├───mentcode
│       connectDB.mf
│       instruct.txt
│       ment.md
│
├───.github
│   └───workflows
│           main.yml
│
└───app
    │   hotkeys_guide.txt
    │   index.html
    │
    ├───cfop
    │       cfop-data.js
    │       cfop-drawer.js
    │       f2l-renderer.js
    │       oll-renderer.js
    │
    ├───css
    │       style.css
    │       style2.css
    │       watermark.css
    │
    └───js
            controls.js
            cube.js
            drag.js
            hotkeys.js
            main.js
            ui.js
			
			
4. Phases Log
Phase 1 (Core WebGL Engine & UI): Three.js 3D canvas, keyboard bindings, timer, move queue scrubber, and panel layout.   
Phase 2 (CFOP Module Integration): F2L/OLL case drawers, SVG rendering pipelines, and setup/run automation[cite: 10, 11, 12, 13].
5. Next Upgrades 
Implement PLL algorithm case suite.Add customizable color theme picker.