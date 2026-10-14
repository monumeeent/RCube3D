// cfop-drawer.js — Left sidebar: icon rail + collapsible algorithm drawer
// Connected to: window.CFOP_DATA (cfop-data.js), window.CfopSVG (svg-renderer.js),
//               window.enqueueCubeMoves, window.queueMove (controls.js)

(() => {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────
  let activeSet = null;     // key in CFOP_DATA, e.g. 'oll'
  let drawerOpen = false;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* noop */ } }
  };

  const caseValidationErrors = new WeakMap();

  function validateAllAlgorithms() {
    for (const [setKey, set] of Object.entries(window.CFOP_DATA)) {
      for (const subcat of set.subcats || []) {
        for (const caseData of subcat.cases || []) {
          try {
            window.CubeNotation.parseAlgorithm(caseData.alg);
          } catch (error) {
            caseValidationErrors.set(caseData, error.message);
            console.error(
              `[cfop-drawer] Invalid algorithm ${setKey}/${caseData.id}:`,
              error
            );
          }
        }
      }
    }
  }

  // ── Wait for DOM + deps ────────────────────────────────────────────────
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  ready(() => {
    // Deps may load slightly after DOMContentLoaded; defer one tick
    requestAnimationFrame(() => {
      if (!window.CFOP_DATA || !window.CfopSVG || !window.CubeNotation) {
        console.error('[cfop-drawer] Missing CFOP data, renderer, or notation module.');
        return;
      }

      validateAllAlgorithms();
      buildDOM();
      restoreState();
    });
  });

  // ── DOM Construction ───────────────────────────────────────────────────
  function buildDOM() {
    // 1. Inject global styles
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    // 2. Wrap .app in a new root that adds the left rail column
    const app = document.querySelector('.app');
    if (!app) return;

    const root = document.createElement('div');
    root.className = 'cfop-root';
    app.parentNode.insertBefore(root, app);
    root.appendChild(app);

    // 3. Build sidebar: icon rail + drawer panel
    const sidebar = document.createElement('aside');
    sidebar.className = 'cfop-sidebar';
    sidebar.setAttribute('aria-label', 'CFOP Algorithm Library');
    root.insertBefore(sidebar, app);

    // Icon rail
    const rail = document.createElement('nav');
    rail.className = 'cfop-rail';
    rail.setAttribute('aria-label', 'Algorithm sets');
    sidebar.appendChild(rail);

    // Build rail buttons
    Object.entries(window.CFOP_DATA).forEach(([key, set]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cfop-rail-btn';
      btn.dataset.set = key;
      btn.setAttribute('aria-label', `${set.label} —${set.badge} cases`);
      btn.innerHTML = `
        <span class="cfop-rail-label">${set.label}</span>
        <span class="cfop-rail-badge">${set.badge}</span>
      `;
      btn.style.setProperty('--rail-color', set.color);
      btn.addEventListener('click', () => toggleSet(key));
      rail.appendChild(btn);
    });
    
    // Append Watermark to the bottom of the rail
    const watermarkWrap = document.createElement('div');
    watermarkWrap.className = 'cfop-watermark-wrap';
    watermarkWrap.innerHTML = `
      <h1 class="cfop-watermark">
        MONUMEEENT
        <span>MONUMEEENT</span>
        <span>MONUMEEENT</span>
        <span></span>
      </h1>`;
    rail.appendChild(watermarkWrap);

    // Drawer panel
    const drawer = document.createElement('div');
    drawer.className = 'cfop-drawer';
    drawer.id = 'cfopDrawer';
    drawer.setAttribute('aria-label', 'Algorithm cases');
    sidebar.appendChild(drawer);

    // Build drawer header (dynamically populated)
    const drawerHead = document.createElement('div');
    drawerHead.className = 'cfop-drawer-head';
    drawerHead.id = 'cfopDrawerHead';
    drawer.appendChild(drawerHead);

    // Card list container
    const list = document.createElement('div');
    list.className = 'cfop-card-list';
    list.id = 'cfopCardList';
    drawer.appendChild(list);

    // Close button inside drawer
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'cfop-drawer-close';
    closeBtn.setAttribute('aria-label', 'Close algorithm drawer');
    closeBtn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-x"/></svg>';
    closeBtn.addEventListener('click', closeDrawer);
    drawerHead.appendChild(closeBtn);
	const mobileCfopButton = document.getElementById('mbb-cfop');
if (mobileCfopButton) {
  mobileCfopButton.setAttribute('aria-controls', 'cfopDrawer');
  mobileCfopButton.addEventListener('click', toggleMobileDrawer);
}
syncMobileCfopButton();
document.addEventListener('mobile:sheet-open', e => {
  if (
    window.matchMedia('(max-width: 860px)').matches &&
    e.detail?.sheet !== 'cfop' &&
    drawerOpen
  ) {
    closeDrawer();
  }
});
    document.dispatchEvent(new Event('cfop:ready'));
  }

  // b. Replace the [ / Escape keydown handler with a version that ignores [ while typing:
  window.addEventListener('keydown', e => {
    if (e.isComposing) return;
    const typing = e.target instanceof Element &&
      e.target.closest('input, textarea, select, [contenteditable="true"]');
    if (e.key === '[' && !e.ctrlKey && !e.metaKey && !typing) {
      e.preventDefault();
      if (drawerOpen) closeDrawer(); else if (activeSet) openDrawer();
      return;
    }
    if (e.key === 'Escape' && drawerOpen) closeDrawer();
  });

  // ── State helpers ──────────────────────────────────────────────────────
  function toggleSet(key) {
    if (activeSet === key && drawerOpen) { closeDrawer(); return; }
    activeSet = key;
    drawerOpen = true;
    renderDrawer();
    updateRail();
    openDrawer();
    saveState();
  }
  
  function toggleMobileDrawer() {
  if (drawerOpen) {
    closeDrawer();
    return;
  }

  if (!activeSet || !window.CFOP_DATA[activeSet]) {
    activeSet = window.CFOP_DATA.f2l
      ? 'f2l'
      : Object.keys(window.CFOP_DATA)[0];
  }

  if (!activeSet) return;

  renderDrawer();
  updateRail();
  openDrawer();
}

function syncMobileCfopButton() {
  const button = document.getElementById('mbb-cfop');
  if (!button) return;

  button.setAttribute('aria-controls', 'cfopDrawer');
  button.setAttribute('aria-expanded', String(drawerOpen));
  button.setAttribute(
    'aria-label',
    drawerOpen ? 'Close CFOP library' : 'Open CFOP library'
  );
  button.classList.toggle('is-live', drawerOpen);
}

  function openDrawer() {
    drawerOpen = true;
    const drawer = document.getElementById('cfopDrawer');
    const sidebar = document.querySelector('.cfop-sidebar');
    drawer?.classList.add('is-open');
    sidebar?.classList.add('drawer-visible');
    if (window.matchMedia('(max-width: 860px)').matches) {
  document.dispatchEvent(new CustomEvent('mobile:sheet-open', {
    detail: { sheet: 'cfop' }
  }));
}
	
    saveState();
	syncMobileCfopButton()
  }

  function closeDrawer() {
    drawerOpen = false;
    const drawer = document.getElementById('cfopDrawer');
    const sidebar = document.querySelector('.cfop-sidebar');
    drawer?.classList.remove('is-open');
    sidebar?.classList.remove('drawer-visible');

    saveState();
	syncMobileCfopButton()
  }

  function updateRail() {
    document.querySelectorAll('.cfop-rail-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.set === activeSet && drawerOpen);
    });
  }

  // ── Collapse/Expand All: label and accessible name ─────────────────────
  // allExpanded = true means the next click collapses everything.
  function setCollapseAllState(btn, allExpanded) {
    btn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
    btn.setAttribute(
      'aria-label',
      allExpanded ? 'Collapse all sections' : 'Expand all sections'
    );
  }

  // Recomputes the button from the DOM, so single-section toggles also update it.
  function syncCollapseAllButton() {
    const btn = document.querySelector('#cfopDrawerHead .cfop-collapse-all-btn');
    const list = document.getElementById('cfopCardList');
    if (!btn || !list) return;
    const toggles = [...list.querySelectorAll('.cfop-drawer-toggle')];
    const allExpanded = toggles.length > 0 &&
      toggles.every(b => b.getAttribute('aria-expanded') === 'true');
    setCollapseAllState(btn, allExpanded);
  }

  // One delegated listener on the list. It survives re-renders, so bind only once.
  let collapseSyncBound = false;
  function bindCollapseAllSync() {
    if (collapseSyncBound) return;
    const list = document.getElementById('cfopCardList');
    if (!list) return;
    collapseSyncBound = true;
    // The section toggle's own handler runs first (target phase), then this bubbles up.
    list.addEventListener('click', e => {
      if (e.target instanceof Element && e.target.closest('.cfop-drawer-toggle')) {
        syncCollapseAllButton();
      }
    });
  }



  // ── Render drawer content ──────────────────────────────────────────────
  function renderDrawer() {
    const setData = window.CFOP_DATA[activeSet];
    if (!setData) return;

    // Header title
    const head = document.getElementById('cfopDrawerHead');
    const closeBtn = head?.querySelector('.cfop-drawer-close');
    if (head) {
      head.replaceChildren();
      const title = document.createElement('h2');
      title.className = 'cfop-drawer-title';
      title.textContent = setData.label;
      const count = document.createElement('span');
      count.className = 'cfop-drawer-count';
      count.textContent = `${setData.badge} cases`;

      // Collapse-all / expand-all toggle
      const collapseAllBtn = document.createElement('button');
      collapseAllBtn.type = 'button';
      collapseAllBtn.className = 'cfop-collapse-all-btn';
      setCollapseAllState(collapseAllBtn, true); // sections start expanded
      collapseAllBtn.addEventListener('click', () => {
        const list = document.getElementById('cfopCardList');
        if (!list) return;
        const toggles = [...list.querySelectorAll('.cfop-drawer-toggle')];
        const allExpanded = toggles.length > 0 &&
          toggles.every(b => b.getAttribute('aria-expanded') === 'true');
        const targetExpanded = !allExpanded;
        toggles.forEach(b => b.setAttribute('aria-expanded', String(targetExpanded)));
        list.querySelectorAll('.cfop-drawer-section-body').forEach(body => {
          body.classList.toggle('is-expanded', targetExpanded);
          body.classList.toggle('is-collapsed', !targetExpanded);
        });
        syncCollapseAllButton();
      });

      head.appendChild(title);
      head.appendChild(count);
      head.appendChild(collapseAllBtn);
      if (closeBtn) head.appendChild(closeBtn);
    }

    renderCards();
    bindCollapseAllSync();
    syncCollapseAllButton();
  }
  
  
  
  function renderCards() {
    const setData = window.CFOP_DATA[activeSet];
    if (!setData) return;
    const list = document.getElementById('cfopCardList');
    if (!list) return;
    list.replaceChildren();

    setData.subcats.forEach((sub, index) => {
      const sectionId = `cfop-drawer-content-${index}`;

      // 1. Accordion Drawer Header
      const header = document.createElement('div');
      header.className = 'cfop-drawer-section-header';
      header.innerHTML = `
        <button 
          type="button" 
          class="cfop-drawer-toggle" 
          aria-expanded="true" 
          aria-controls="${sectionId}">
          <span class="cfop-drawer-section-title">${sub.label}</span>
          <span class="cfop-drawer-section-count">${sub.cases.length}</span>
          <svg class="ic cfop-drawer-chevron" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      `;

      // 2. Accordion Drawer Body Wrapper
      const drawerBody = document.createElement('div');
      drawerBody.id = sectionId;
      drawerBody.className = 'cfop-drawer-section-body is-expanded';

      const drawerInner = document.createElement('div');
      drawerInner.className = 'cfop-drawer-section-inner';

      // 3. Render Cards inside Inner Drawer
      sub.cases.forEach(c => {
        const card = buildCard(c, setData.color);
        drawerInner.appendChild(card);
      });

      drawerBody.appendChild(drawerInner);

      // 4. Attach Toggle Listener
      const toggleBtn = header.querySelector('.cfop-drawer-toggle');
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        drawerBody.classList.toggle('is-expanded', !isExpanded);
        drawerBody.classList.toggle('is-collapsed', isExpanded);
      });

      list.appendChild(header);
      list.appendChild(drawerBody);
    });
  }

  function buildCard(caseData, color) {
    const card = document.createElement('div');
    card.className = 'cfop-card';
    card.style.setProperty('--card-color', color);

    // Check validation error first
    const validationError = caseValidationErrors.get(caseData);
    if (validationError) {
      card.classList.add('cfop-card-invalid');

      const name = document.createElement('span');
      name.className = 'cfop-card-name';
      name.textContent = caseData.name || caseData.id || 'Invalid case';

      const message = document.createElement('p');
      message.className = 'cfop-card-error';
      message.setAttribute('role', 'alert');
      message.textContent = `Algorithm unavailable: ${validationError}`;

      card.append(name, message);
      return card;
    }

    try {
      // 1. Generate diagram SVG
      let svgHtml = '';
      if (activeSet === 'pll' && window.PllSVG) {
        svgHtml = window.PllSVG.buildPllSVG(caseData);
      } else if (activeSet === 'oll' && window.OllSVG) {
        svgHtml = window.OllSVG.buildOllSVG(caseData.alg);
      } else if (activeSet === 'wv' && window.WvSVG) {
        svgHtml = window.WvSVG.buildSVG(caseData);
      } else if (window.F2lSVG) {
        svgHtml = window.F2lSVG.buildSVG(caseData);
      } else if (window.CfopSVG) {
        svgHtml = window.CfopSVG.buildSVG(caseData);
      }
      
      if (svgHtml) {
        const svgSetClass = `cfop-svg-${activeSet}`;
        const tmp = document.createElement('div');
        tmp.innerHTML = svgHtml;
        const svgEl = tmp.querySelector('svg');
        if (svgEl) {
          svgEl.classList.add(svgSetClass);
          card.appendChild(svgEl);
        }
      }
    } catch (error) {
      console.warn(`[cfop-drawer] Could not render diagram for ${caseData.id}:`, error);
      const warning = document.createElement('div');
      warning.className = 'cfop-card-diagram-error';
      warning.setAttribute('role', 'img');
      warning.setAttribute('aria-label', `Diagram unavailable for ${caseData.name}`);
      warning.textContent = 'Diagram unavailable';
      warning.title = error.message;
      card.appendChild(warning);
    }

    // 2. Card Info
    const info = document.createElement('div');
    info.className = 'cfop-card-info';

    const name = document.createElement('span');
    name.className = 'cfop-card-name';
    name.textContent = caseData.name;
    info.appendChild(name);

    const alg = document.createElement('code');
    alg.className = 'cfop-card-alg';
    alg.textContent = caseData.alg;
    info.appendChild(alg);

    card.appendChild(info);

    // 3. Card Action Buttons
    const actions = document.createElement('div');
    actions.className = 'cfop-card-actions';

    // Run Button
    const runBtn = document.createElement('button');
    runBtn.type = 'button';
    runBtn.className = 'cfop-action-btn cfop-run';
    runBtn.setAttribute('aria-label', `Run ${caseData.name}`);
    runBtn.setAttribute('title', `Run ${caseData.name}`);
    runBtn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-play"/></svg>';
    runBtn.addEventListener('click', () => loadAndRunAlg(caseData.alg, false, caseData.name));

    // Setup Button
    const setupBtn = document.createElement('button');
    setupBtn.type = 'button';
    setupBtn.className = 'cfop-action-btn cfop-setup';
    setupBtn.setAttribute('aria-label', `Setup ${caseData.name}`);
    setupBtn.setAttribute('title', `Setup ${caseData.name}`);
    setupBtn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-undo"/></svg>';
    setupBtn.addEventListener('click', () => loadAndRunAlg(caseData.alg, true, caseData.name));

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'cfop-action-btn cfop-copy';
    copyBtn.setAttribute('aria-label', `Copy ${caseData.name} algorithm`);
    copyBtn.setAttribute('title', `Copy ${caseData.name} algorithm`);
    copyBtn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-copy"/></svg>';
    copyBtn.addEventListener('click', () => copyAlgorithm(caseData, copyBtn));

    actions.appendChild(runBtn);
    actions.appendChild(setupBtn);
    actions.appendChild(copyBtn);
    card.appendChild(actions);

    return card;
  }

  // ── Execute via #algForm input ──────────────────────────────────────────
  function loadAndRunAlg(rawAlg, isSetup = false, caseName = '') {
    const inputEl = document.getElementById('alg-input');
    const formEl = document.getElementById('algForm');

    if (!inputEl) {
      window.reportCubeStatus?.('Algorithm input field not found.', true);
      return;
    }

    let cleanAlg = rawAlg;

    try {
      if (isSetup) {
        if (window.CubeNotation && typeof window.CubeNotation.invertAlgorithm === 'function') {
          cleanAlg = window.CubeNotation.invertAlgorithm(rawAlg);
        } else if (window.CfopSVG && typeof window.CfopSVG.getInverseReverseAlg === 'function') {
          cleanAlg = window.CfopSVG.getInverseReverseAlg(rawAlg);
        } else {
          const tokens = rawAlg
            .replace(/[()]/g, '')
            .replace(/[\u2018\u2019]/g, "'")
            .trim()
            .split(/\s+/);

          cleanAlg = tokens
            .map(m => m.endsWith("'") ? m.slice(0, -1) : m.endsWith("2") ? m : m + "'")
            .reverse()
            .join(' ');
        }
      } else {
        if (window.CubeNotation && typeof window.CubeNotation.parseAlgorithm === 'function') {
          cleanAlg = window.CubeNotation.parseAlgorithm(rawAlg).join(' ');
        } else {
          cleanAlg = rawAlg
            .replace(/[()]/g, '')
            .replace(/[\u2018\u2019]/g, "'")
            .trim();
        }
      }
    } catch (error) {
      window.reportCubeStatus?.(
        `Cannot run ${caseName || 'algorithm'}: ${error.message}`,
        true
      );
      return;
    }

    // Insert clean algorithm into the Move Queue input box
    inputEl.value = cleanAlg;
    inputEl.focus();

    // Trigger the form submit event to load onto track and start auto-play
    if (formEl) {
      if (typeof formEl.requestSubmit === 'function') {
        formEl.requestSubmit();
      } else {
        formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }

    // On phones the sheet covers the cube. Close it so the run is visible.
    if (window.matchMedia('(max-width: 860px)').matches) closeDrawer();

    window.reportCubeStatus?.(
      isSetup ? `Loaded setup for ${caseName}.` : `Running ${caseName}.`
    );
  }

  // ── Execute & Copy ────────────────────────────────────────────────     
  async function copyAlgorithm(caseData, btn) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(caseData.alg);
      } else {
        const ta = document.createElement('textarea');
        ta.value = caseData.alg;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      btn.classList.add('copied');
      window.reportCubeStatus?.(`Copied ${caseData.name}.`);
      setTimeout(() => btn.classList.remove('copied'), 1400);
    } catch {
      window.reportCubeStatus?.('Could not copy.', true);
    }
  }

  // ── Persist state ──────────────────────────────────────────────────────
  function saveState() {
    store.set('rcube3d.cfop', JSON.stringify({ set: activeSet, open: drawerOpen }));
  }

  function restoreState() {
    try {
      const saved = JSON.parse(store.get('rcube3d.cfop') || '{}');
      if (saved.set && window.CFOP_DATA[saved.set]) {
        activeSet = saved.set;
        if (saved.open) {
          renderDrawer();
          updateRail();
          openDrawer();
        } else {
          updateRail();
        }
      }
    } catch { /* ignore */ }
  }

  const STYLES = ``;

})();