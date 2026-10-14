📂 Structure of mentC.md (The Codebase Registry)
This file will serve as the single source of truth. Every time you start a session or make major upgrades, the AI will reference or update this structure.

Markdown


# Project Codebase Registry (`mentC.md`)
> **Last Updated:** YYYY-MM-DD | **Active Version:** v1.0

## 🌳 1. File Tree & Directory Structure
root/
├── index.html
├── css/
│   ├── style.css
│   └── feature.css
└── js/
├── main.js
└── api.js


## 🔗 2. File Connections & Function Map

| File Path & Name | Connected Files | Core Functions | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `js/main.js` | `index.html`, `style.css`, `js/api.js` | `initApp()`, `handleEvent()` | Main UI controller and event listeners. |
| `js/api.js` | `js/main.js` | `fetchData()`, `postData()` | Centralized API abstraction layer. |

## 🔄 3. Recent Update Log
### [Phase X] - YYYY-MM-DD
- **Changed:** Updated `handleEvent()` in `js/main.js` to support asynchronous state updates.
- **Removed:** Legacy listener bindings from base version.
- **Current State:** Fully synchronized with local builds.
⚙️ How the Workflow Operates
AI Reference:
Whenever you prompt the AI, it reads mentC.md to instantly know which file handles what, how files are connected, and what functions exist.
Also Updates it each time after new file added or any updates . 
Targeted Code Requests:
If the AI needs to modify or analyze a specific function whose full code isn't currently in active memory, it will prompt you cleanly like this:

"I see handleEvent() in js/main.js is connected to this feature. Could you share the code block for js/main.js so I can review the latest implementation?"

Memory Replacement & Auto-Logging:
When you provide updated code, the AI discards the old version, memorizes the new implementation, and automatically appends the change log directly into mentC.md under the Recent Update Log.

📝 Standard File Header Reminder
To make this foolproof, every code file you create should start with your standard 3-line metadata header so the AI immediately recognizes its connections:

JavaScript


// js/main.js
// Files Connected: [index.html, style.css, js/api.js] | Code: JS | Functions: [initApp, handleEvent]
// Work: Core UI Interactions | Main Purpose: Manages user interface events and state
// Last Edit Time: 2026-10-14 02:00:00