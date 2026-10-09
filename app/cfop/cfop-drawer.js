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

  // ── Wait for DOM + deps ────────────────────────────────────────────────
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  ready(() => {
    // Deps may load slightly after DOMContentLoaded; defer one tick
    requestAnimationFrame(() => {
      if (!window.CFOP_DATA || !window.CfopSVG) {
        console.error('[cfop-drawer] Missing CFOP_DATA or CfopSVG');
        return;
      }
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
      btn.setAttribute('aria-label', `${set.label} — ${set.badge} cases`);
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

    // Keyboard: [ to toggle, Escape to close
    window.addEventListener('keydown', e => {
      if (e.isComposing) return;
      if (e.key === '[' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (drawerOpen) closeDrawer(); else if (activeSet) openDrawer();
        return;
      }
      if (e.key === 'Escape' && drawerOpen) closeDrawer();
    });
  }

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

  function triggerCanvasResize() {
    let start = performance.now();
    function loop(now) {
      window.dispatchEvent(new Event('resize'));
      if (now - start < 400) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function openDrawer() {
    drawerOpen = true;
    const drawer = document.getElementById('cfopDrawer');
    const sidebar = document.querySelector('.cfop-sidebar');
    drawer?.classList.add('is-open');
    sidebar?.classList.add('drawer-visible');
    
    triggerCanvasResize();
    saveState();
  }

  function closeDrawer() {
    drawerOpen = false;
    const drawer = document.getElementById('cfopDrawer');
    const sidebar = document.querySelector('.cfop-sidebar');
    drawer?.classList.remove('is-open');
    sidebar?.classList.remove('drawer-visible');

    triggerCanvasResize();
    saveState();
  }

  function updateRail() {
    document.querySelectorAll('.cfop-rail-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.set === activeSet && drawerOpen);
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
      head.appendChild(title);
      head.appendChild(count);
      if (closeBtn) head.appendChild(closeBtn);
    }

    renderCards();
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

    // 1. Generate Diagram (2D Top View for OLL, Isometric for F2L & others)
    const svgWrap = document.createElement('div');
    svgWrap.className = 'cfop-card-diagram';

    if (activeSet === 'oll' && window.OllSVG) {
      svgWrap.innerHTML = window.OllSVG.buildOllSVG(caseData.alg);
    } else if (window.F2lSVG) {
      svgWrap.innerHTML = window.F2lSVG.buildSVG(caseData);
    }

    card.appendChild(svgWrap);

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

    // 3. Card Action Buttons (SVG Icons Only)
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

    if (isSetup) {
      // Invert algorithm sequence for setup
      if (window.CfopSVG && typeof window.CfopSVG.getInverseReverseAlg === 'function') {
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
      // Strip brackets and normalize apostrophes
      cleanAlg = rawAlg
        .replace(/[()]/g, '')
        .replace(/[\u2018\u2019]/g, "'")
        .trim();
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

    window.reportCubeStatus?.(
      isSetup ? `Loaded setup for ${caseName}.` : `Running ${caseName}.`
    );
  }
  
  
  // ── Execute & Copy ─────────────────────────────────────────────────────
  function runAlgorithm(caseData) {
    const tokens = caseData.alg.replace(/[\u2018\u2019]/g, "'").trim().split(/\s+/);
    if (!window.enqueueCubeMoves) {
      window.reportCubeStatus?.('Controls not ready.', true);
      return;
    }
    try {
      window.enqueueCubeMoves(tokens);
      window.reportCubeStatus?.(`Running ${caseData.name}.`);
    } catch (err) {
      window.reportCubeStatus?.(err.message, true);
    }
  }

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