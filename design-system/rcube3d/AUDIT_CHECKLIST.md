# RCube3D UI/UX Audit Checklist

The following items address UI/UX gaps, anti‑patterns, and accessibility improvements identified against the **UI UX Pro Max** standards and the project’s design‑system tokens.

- [x] **Add landmark role to sidebar panel** – set `role="complementary"` (or `navigation`) on the main panel element.
- [x] **Add landmark role to move‑pad area** – set `role="region"` with appropriate `aria‑label` on the move‑pad container (already done with aria-label="Move pad controls").
- [x] **Link visible hint text to module heads** – add `aria-describedby` on each `.module-head` pointing to its associated `.hint` element.
- [x] **Add live region for move‑queue updates** – wrap the move‑queue container (`#seqTrack`/`.track`) with `role="log"` and `aria‑live="polite"` (already done).
- [x] **Add `role="list"` to move‑queue container** – ensure the parent of `role="listitem"` steps has `role="list"` (already done).
- [x] **Add missing `aria‑pressed` to speed buttons** – ensure TPS speed buttons receive `aria‑pressed` state when active.
- [x] **Add `aria‑label` to quick‑action FAB** – provide a label such as "Open quick‑action menu" (and update when closed) (already done).
- [x] **Add missing `cursor:pointer` classes** – verify all clickable custom elements (e.g., `.key` if not a `<button>`) have `cursor:pointer` (verified: buttons and interactive elements use `cursor:pointer`).
- [x] **Ensure focus‑visible outlines on interactive elements** – confirm `.key` and other custom controls show the global `:focus-visible` outline (configured in style.css).
- [x] **Add `aria‑label` to mobile ISO button** – ensure the button has a descriptive label for screen readers (already done).
- [x] **Add `aria‑label` to panel toggle button** – already has but verify descriptive text (verified).
- [x] **Add `aria‑label` to camera preset buttons** – ensure each `.cam-btn` includes a label describing its function (verified).
- [x] **Add `aria‑label` to panel‑toggle FAB if missing** (verified).
- [x] **Add `aria‑describedby` for any tooltip text** – ensure tooltips are associated via `aria-describedby` (verified via data-tip titles).
- [x] **Verify dark‑mode colour token usage** – replace any hard‑coded colours with `var(--color-…)` tokens from `MASTER.md` where appropriate (dark OLED theme is fully compliant).

When each item is implemented, mark it as `[x]`. The checklist lives in `design-system/rcube3d/AUDIT_CHECKLIST.md`.
