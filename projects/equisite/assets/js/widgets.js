/* EquiSite project page — explanatory schematics and result charts.
   All numbers below are the measured values reported in the paper and its appendix. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const onTheme = (fn) => {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fn);
    new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  };
  const seg = (root, fn) => {
    $$('button', root).forEach((b) => b.addEventListener('click', () => {
      $$('button', root).forEach((x) => x.setAttribute('aria-pressed', x === b));
      fn(b.dataset.v);
    }));
  };
  const f3 = (x) => x.toFixed(3);
  const signed = (x, d = 3) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d);

  /* ------------------------------------------------ 1. who is responsible for which site? */
  (function assign() {
    const left = $('#assign-match'), right = $('#assign-anchor');
    if (!left) return;
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs, parent, text) => {
      const n = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
      if (text != null) n.textContent = text;
      parent.appendChild(n);
      return n;
    };
    const Q = 6, K = 3;
    const qy = (i) => 44 + i * 31, sy = (k) => 75 + k * 46.5;
    const base = Array.from({ length: Q }, (_, i) => Array.from({ length: K }, (_, k) => 1.2 + 0.9 * Math.abs(i / (Q - 1) - k / (K - 1)) + 0.25 * Math.sin(3.1 * i + 1.7 * k)));
    let noise = base.map((r) => r.map(() => 0));
    let step = 0, prev = null, timer = null;
    const rnd = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.15;
    function solve() {
      let best = Infinity, arg = null;
      for (let a = 0; a < Q; a++) for (let b = 0; b < Q; b++) for (let c = 0; c < Q; c++) {
        if (a === b || a === c || b === c) continue;
        const v = base[a][0] + noise[a][0] + base[b][1] + noise[b][1] + base[c][2] + noise[c][2];
        if (v < best) { best = v; arg = [a, b, c]; }
      }
      return arg;
    }
    function draw() {
      const col = [css('--s1'), css('--s2'), css('--s3')], ink = css('--ink'), muted = css('--muted'), line = css('--line-strong'), surf = css('--surface'), res = css('--res');
      const m = solve();
      // ---- matching panel
      left.innerHTML = '';
      mk('text', { x: 46, y: 18, 'text-anchor': 'middle', 'font-size': 10.5, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, left, 'queries');
      mk('text', { x: 268, y: 18, 'text-anchor': 'middle', 'font-size': 10.5, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, left, 'labelled sites');
      m.forEach((qi, k) => {
        const changed = prev && prev[k] !== qi;
        const l = mk('line', { x1: 60, y1: qy(qi), x2: 252, y2: sy(k), stroke: col[k], 'stroke-width': changed ? 3.2 : 2.2, 'stroke-linecap': 'round' }, left);
        if (changed && !reduceMotion) l.animate([{ opacity: 0.1 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
      });
      for (let i = 0; i < Q; i++) {
        const k = m.indexOf(i);
        mk('circle', { cx: 46, cy: qy(i), r: 12, fill: k >= 0 ? col[k] : surf, stroke: k >= 0 ? col[k] : line, 'stroke-width': 1.5 }, left);
        mk('text', { x: 46, y: qy(i) + 3.6, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 600, fill: k >= 0 ? surf : muted, 'font-family': 'Archivo, sans-serif' }, left, 'q' + (i + 1));
        if (k < 0) mk('text', { x: 70, y: qy(i) + 3.6, 'font-size': 10, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, left, '→ no site');
      }
      for (let k = 0; k < K; k++) {
        mk('rect', { x: 254, y: sy(k) - 13, width: 28, height: 26, rx: 2, fill: col[k] }, left);
        mk('text', { x: 268, y: sy(k) + 4.2, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: surf, 'font-family': 'Archivo, sans-serif' }, left, 'ABC'[k]);
      }
      mk('text', { x: 46, y: 232, 'text-anchor': 'middle', 'font-size': 10, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, left, '⋮ 32 in all');
      // ---- anchor panel
      right.innerHTML = '';
      const n = 17, pts = Array.from({ length: n }, (_, i) => [22 + i * 17.2, 172 + 20 * Math.sin(i * 0.62)]);
      const member = (i) => (i >= 1 && i <= 5 ? 0 : i >= 7 && i <= 10 ? 1 : i >= 12 && i <= 15 ? 2 : -1);
      const anchors = [3, 8, 14], sx = [56, 160, 264];
      mk('text', { x: 160, y: 18, 'text-anchor': 'middle', 'font-size': 10.5, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, right, 'labelled sites');
      mk('text', { x: 160, y: 232, 'text-anchor': 'middle', 'font-size': 10.5, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, right, 'residues of the protein');
      mk('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: css('--bond'), 'stroke-width': 2 }, right);
      anchors.forEach((a, k) => {
        mk('line', { x1: sx[k], y1: 72, x2: pts[a][0], y2: pts[a][1] - 11, stroke: col[k], 'stroke-width': 2.2, 'stroke-linecap': 'round' }, right);
        mk('rect', { x: sx[k] - 14, y: 46, width: 28, height: 26, rx: 2, fill: col[k] }, right);
        mk('text', { x: sx[k], y: 63.2, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: surf, 'font-family': 'Archivo, sans-serif' }, right, 'ABC'[k]);
      });
      pts.forEach((p, i) => {
        const k = member(i);
        mk('circle', { cx: p[0], cy: p[1], r: anchors.includes(i) ? 7 : 5.5, fill: k >= 0 ? col[k] : res }, right);
        if (anchors.includes(i)) mk('circle', { cx: p[0], cy: p[1], r: 10, fill: 'none', stroke: ink, 'stroke-width': 2 }, right);
      });
      anchors.forEach((a, k) => mk('text', { x: pts[a][0], y: pts[a][1] + 25, 'text-anchor': 'middle', 'font-size': 10, fill: ink, 'font-family': 'Archivo, sans-serif', 'font-weight': 600 }, right, 'anchor'));
      $('#assign-step').textContent = step;
      const changedN = prev ? m.filter((x, k) => x !== prev[k]).length : 0;
      $('#assign-msg').textContent = step === 0 ? 'Press “Next training step”.' : changedN ? `Matching re-solved: ${changedN} site${changedN > 1 ? 's' : ''} moved to a different query. Anchors: unchanged.` : 'Matching re-solved: same assignment as before. Anchors: unchanged.';
      prev = m;
    }
    function next() {
      step++;
      noise = noise.map((r) => r.map((v) => v * 0.55 + rnd()));
      draw();
    }
    $('#assign-next').addEventListener('click', next);
    const auto = $('#assign-auto');
    auto.addEventListener('change', () => {
      clearInterval(timer);
      if (auto.checked) timer = setInterval(() => { if (!document.hidden) next(); }, 1600);
    });
    onTheme(() => { const p = prev; prev = null; draw(); prev = p; });
    draw();
  })();

  /* ------------------------------------------------ 2. anchor toy */
  (function anchorToy() {
    const cv = $('#anchor-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = 640, H = 350, PX_PER_A = 15.8;
    const A = new Set([1, 2, 3, 13, 14, 15, 22]), B = new Set([9, 10, 11, 13, 23, 24, 25, 12]);
    B.delete(12); B.delete(9);
    let pts, drag = -1, showVotes = true, scale = 1, w = 0, h = 0;
    function layout() {
      pts = [];
      const rows = [92, 176, 262];
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) {
        const col = r === 1 ? 8 - i : i;
        const k = r * 9 + i;
        pts.push([80 + col * 60 + 9 * Math.sin(k * 2.3), rows[r] + 11 * Math.cos(k * 1.7)]);
      }
    }
    function solve() {
      const sites = [{ id: 'A', set: A }, { id: 'B', set: B }].map((s) => {
        const mem = [...s.set];
        const c = [0, 0];
        mem.forEach((i) => { c[0] += pts[i][0] / mem.length; c[1] += pts[i][1] / mem.length; });
        return { ...s, mem, c };
      });
      const claimed = new Set();
      [...sites].sort((a, b) => b.mem.length - a.mem.length).forEach((s) => {
        const order = [...s.mem].sort((i, j) => Math.hypot(pts[i][0] - s.c[0], pts[i][1] - s.c[1]) - Math.hypot(pts[j][0] - s.c[0], pts[j][1] - s.c[1]));
        const pick = order.find((i) => !claimed.has(i));
        s.anchor = pick == null ? order[0] : pick;
        s.second = s.anchor !== order[0];
        s.d = Math.hypot(pts[s.anchor][0] - s.c[0], pts[s.anchor][1] - s.c[1]) / PX_PER_A;
        claimed.add(s.anchor);
      });
      return sites;
    }
    function resize() {
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      const d = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = Math.round(w * d); cv.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      scale = Math.min(w / W, h / H);
      draw();
    }
    const X = (p) => (w - W * scale) / 2 + p[0] * scale, Y = (p) => (h - H * scale) / 2 + p[1] * scale;
    function draw() {
      if (!w) return;
      const col = { A: css('--s1'), B: css('--s2') }, ink = css('--ink'), res = css('--res'), bond = css('--bond'), surf = css('--surface');
      const sites = solve();
      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = ctx.lineCap = 'round';
      ctx.strokeStyle = bond; ctx.lineWidth = 2.2 * scale + 0.6;
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p)))); ctx.stroke();
      if (showVotes) {
        ctx.lineWidth = 1.2;
        pts.forEach((p, i) => {
          const own = sites.filter((s) => s.set.has(i)).sort((a, b) => Math.hypot(p[0] - a.c[0], p[1] - a.c[1]) - Math.hypot(p[0] - b.c[0], p[1] - b.c[1]))[0];
          if (!own) return;
          const x0 = X(p), y0 = Y(p), x1 = X(own.c), y1 = Y(own.c), len = Math.hypot(x1 - x0, y1 - y0);
          if (len < 16) return;
          const ux = (x1 - x0) / len, uy = (y1 - y0) / len, e = len - 9;
          ctx.globalAlpha = 0.6; ctx.strokeStyle = ctx.fillStyle = col[own.id];
          ctx.beginPath(); ctx.moveTo(x0 + ux * 10, y0 + uy * 10); ctx.lineTo(x0 + ux * e, y0 + uy * e); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x0 + ux * e, y0 + uy * e); ctx.lineTo(x0 + ux * (e - 6) - uy * 3, y0 + uy * (e - 6) + ux * 3); ctx.lineTo(x0 + ux * (e - 6) + uy * 3, y0 + uy * (e - 6) - ux * 3); ctx.closePath(); ctx.fill();
          ctx.globalAlpha = 1;
        });
      }
      const r0 = clamp(9 * scale, 6, 11);
      sites.forEach((s) => {
        ctx.globalAlpha = 0.09; ctx.fillStyle = col[s.id];
        s.mem.forEach((i) => { ctx.beginPath(); ctx.arc(X(pts[i]), Y(pts[i]), 30 * scale, 0, 6.2832); ctx.fill(); });
        ctx.globalAlpha = 1;
      });
      pts.forEach((p, i) => {
        const a = A.has(i), b = B.has(i);
        ctx.beginPath(); ctx.arc(X(p), Y(p), r0, 0, 6.2832);
        ctx.fillStyle = a ? col.A : b ? col.B : res; ctx.fill();
        if (a && b) { ctx.beginPath(); ctx.arc(X(p), Y(p), r0, -Math.PI / 2, Math.PI / 2); ctx.fillStyle = col.B; ctx.fill(); }
      });
      sites.forEach((s) => {
        const cx = X(s.c), cy = Y(s.c), ax = X(pts[s.anchor]), ay = Y(pts[s.anchor]);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = ink; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]);
        ctx.lineWidth = 2.6; ctx.strokeStyle = ink;
        ctx.beginPath(); ctx.arc(ax, ay, r0 + 4.5, 0, 6.2832); ctx.stroke();
        for (let pass = 0; pass < 2; pass++) {
          ctx.lineWidth = pass ? 2.2 : 5; ctx.strokeStyle = pass ? ink : surf;
          ctx.beginPath(); ctx.moveTo(cx - 6, cy - 6); ctx.lineTo(cx + 6, cy + 6); ctx.moveTo(cx - 6, cy + 6); ctx.lineTo(cx + 6, cy - 6); ctx.stroke();
        }
        ctx.font = '600 12px Archivo, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const ly = ay + (cy < ay ? 1 : -1) * (r0 + 17);
        ctx.lineWidth = 3.5; ctx.strokeStyle = surf; ctx.strokeText('anchor of ' + s.id, ax, ly);
        ctx.fillStyle = col[s.id]; ctx.fillText('anchor of ' + s.id, ax, ly);
      });
      $('#anchor-read').innerHTML = sites.map((s) => `<b style="color:${col[s.id]}">Site ${s.id}</b>: ${s.mem.length} residues · anchor ${s.d.toFixed(1)} Å from the centroid${s.second ? ' (nearest member was already taken by the larger site)' : ''}`).join('<br>');
    }
    const at = (e) => {
      const r = cv.getBoundingClientRect();
      return [(e.clientX - r.left - (w - W * scale) / 2) / scale, (e.clientY - r.top - (h - H * scale) / 2) / scale];
    };
    cv.addEventListener('pointerdown', (e) => {
      const m = at(e);
      let best = -1, bd = 24 / Math.min(scale, 1);
      pts.forEach((p, i) => { const d = Math.hypot(p[0] - m[0], p[1] - m[1]); if (d < bd) { bd = d; best = i; } });
      drag = best;
      if (best >= 0) { try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } cv.style.cursor = 'grabbing'; e.preventDefault(); }
    });
    cv.addEventListener('pointermove', (e) => {
      if (drag < 0) return;
      const m = at(e);
      pts[drag] = [clamp(m[0], 20, W - 20), clamp(m[1], 30, H - 20)];
      draw();
    });
    const end = () => { drag = -1; cv.style.cursor = 'grab'; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    $('#anchor-reset').addEventListener('click', () => { layout(); draw(); });
    $('#anchor-votes').addEventListener('change', (e) => { showVotes = e.target.checked; draw(); });
    new ResizeObserver(resize).observe(cv);
    onTheme(draw);
    layout(); resize();
  })();

  /* ------------------------------------------------ 3. auxiliary signals */
  (function aux() {
    const root = $('#aux');
    if (!root) return;
    // differences to the full model, same seed and evaluation; preds = mean predictions per protein
    const R = {
      '11': { d50: 0, d30: 0, preds: 4.47, label: 'Full model: both auxiliary losses on.' },
      '01': { d50: -0.0266, d30: -0.0264, preds: 4.26, label: 'Without the vote loss.' },
      '10': { d50: -0.0063, d30: -0.0095, preds: 4.26, label: 'Without the objectness loss.' },
      '00': { d50: -0.0510, d30: -0.0432, preds: 6.27, label: 'Without either auxiliary loss.' },
    };
    const vote = $('#aux-vote'), obj = $('#aux-obj');
    function render() {
      const r = R[(vote.checked ? '1' : '0') + (obj.checked ? '1' : '0')];
      $('#aux-label').textContent = r.label;
      [['50', r.d50], ['30', r.d30]].forEach(([k, v]) => {
        $('#aux-bar' + k).style.width = (Math.abs(v) / 0.055 * 100) + '%';
        $('#aux-val' + k).textContent = v === 0 ? '0.000' : signed(v);
      });
      $('#aux-preds').textContent = r.preds.toFixed(2);
      $('#aux-note').textContent = !vote.checked && !obj.checked
        ? 'Removing both costs more than the two individual removals combined, and the model emits more predictions per protein.'
        : !vote.checked ? 'The largest single effect. This measures the value of vote supervision as a training signal.'
          : !obj.checked ? 'A small change, within the seed-to-seed spread of the full model (0.007 AP@0.5).'
            : 'Switch a loss off to see what the model loses without it.';
    }
    vote.addEventListener('change', render); obj.addEventListener('change', render);
    render();
  })();

  /* ------------------------------------------------ 4. main results */
  (function main() {
    const root = $('#main-bars');
    if (!root) return;
    const M = [
      ['Fpocket', 'geometry-based', 0.1836, 0.1017],
      ['Fpocket-rescore', 'ML-based', 0.5075, 0.2349],
      ['P2Rank', 'ML-based', 0.5056, 0.2157],
      ['DeepPocket', 'CNN-based', 0.4273, 0.2334],
      ['GrASP', 'GNN-based', 0.4469, 0.2848],
      ['VN-EGNN', 'equivariant GNN', 0.1621, 0.0705],
      ['UniSite-3D', 'GNN, set prediction', 0.5603, 0.3835],
      ['EquiSite', 'equivariant GNN, ours', 0.6237, 0.4674],
    ];
    root.innerHTML = M.map((m, i) => `<div class="bar-row${i === M.length - 1 ? ' ours' : ''}"><div class="name">${m[0]}<small>${m[1]}</small></div><div class="bar-track"><div class="bar-fill"></div></div><div class="val"></div></div>`).join('');
    const rows = $$('.bar-row', root);
    function render(metric) {
      const k = metric === '30' ? 2 : 3;
      rows.forEach((r, i) => {
        $('.bar-fill', r).style.width = (M[i][k] / 0.7 * 100) + '%';
        $('.val', r).textContent = M[i][k].toFixed(4);
      });
      const u = M[6][k], e = M[7][k];
      $('#main-note').innerHTML = `EquiSite: <b>${e.toFixed(4)}</b> · UniSite-3D: ${u.toFixed(4)} · relative gain <b>+${((e / u - 1) * 100).toFixed(1)}%</b>`;
    }
    seg($('#main-metric'), render);
    render('50');
  })();

  /* ------------------------------------------------ 5. encoder x head swap */
  (function swap() {
    const root = $('#swap');
    if (!root) return;
    const R = {
      'gear|detr': { name: 'UniSite-3D', sub: 'as released', ap50: 0.3835, ap30: 0.5603, params: 32.8 },
      'equi|detr': { name: 'EquiSite encoder + UniSite-3D head', sub: 'only the encoder is swapped', ap50: 0.3901, ap30: 0.5711, params: 7.7 },
      'gear|center': { name: 'UniSite-3D encoder + center nomination head', sub: 'only the head is swapped', ap50: 0.4554, ap30: 0.6142, params: 26.3 },
      'equi|center': { name: 'EquiSite', sub: 'both swapped', ap50: 0.4674, ap30: 0.6237, params: 1.2 },
    };
    const st = { enc: 'equi', head: 'center', metric: '50' };
    function render() {
      $$('[data-enc]', root).forEach((b) => b.setAttribute('aria-pressed', b.dataset.enc === st.enc));
      $$('[data-head]', root).forEach((b) => b.setAttribute('aria-pressed', b.dataset.head === st.head));
      const r = R[st.enc + '|' + st.head], b = R['gear|detr'];
      $('#swap-name').innerHTML = `${r.name}<small>${r.sub} · ${r.params.toFixed(1)}M trainable parameters</small>`;
      [['50', r.ap50, b.ap50], ['30', r.ap30, b.ap30]].forEach(([k, v, v0]) => {
        $('#swap-bar' + k).style.width = (v / 0.7 * 100) + '%';
        $('#swap-val' + k).innerHTML = v.toFixed(4) + (v === v0 ? '' : ` <i>${signed(v - v0)}</i>`);
      });
      $('#swap-barp').style.width = (r.params / 32.8 * 100) + '%';
      $('#swap-valp').textContent = r.params.toFixed(1) + 'M';
      $$('.cell', root).forEach((c) => {
        const rr = R[c.dataset.k];
        c.textContent = (st.metric === '50' ? rr.ap50 : rr.ap30).toFixed(4);
        c.classList.toggle('on', c.dataset.k === st.enc + '|' + st.head);
      });
      // each component's effect, averaged over both settings of the other one
      const g = (k) => (st.metric === '50' ? R[k].ap50 : R[k].ap30);
      const head = ((g('gear|center') - g('gear|detr')) + (g('equi|center') - g('equi|detr'))) / 2;
      const enc = ((g('equi|detr') - g('gear|detr')) + (g('equi|center') - g('gear|center'))) / 2;
      const hp = Math.round(head / (head + enc) * 100);
      $('#attr-head').style.width = hp + '%'; $('#attr-head-t').textContent = `head ${hp}%`;
      $('#attr-enc').style.width = (100 - hp) + '%'; $('#attr-enc-t').textContent = `encoder ${100 - hp}%`;
      $('#attr-note').innerHTML = `Of the ${signed(g('equi|center') - g('gear|detr'))} AP@0.${st.metric === '50' ? '5' : '3'} between UniSite-3D and EquiSite: head ${signed(head)}, encoder ${signed(enc)}.`;
    }
    $$('[data-enc]', root).forEach((b) => b.addEventListener('click', () => { st.enc = b.dataset.enc; render(); }));
    $$('[data-head]', root).forEach((b) => b.addEventListener('click', () => { st.head = b.dataset.head; render(); }));
    $$('.cell', root).forEach((c) => c.addEventListener('click', () => { [st.enc, st.head] = c.dataset.k.split('|'); render(); }));
    seg($('#swap-metric'), (v) => { st.metric = v; render(); });
    render();
  })();

  /* ------------------------------------------------ 6. site multiplicity */
  (function mult() {
    const root = $('#mult');
    if (!root) return;
    const G = [
      ['1 site', '1,587 proteins', [0.566, 0.665], [0.770, 0.821]],
      ['2 sites', '464', [0.391, 0.491], [0.625, 0.681]],
      ['3 sites', '117', [0.226, 0.314], [0.402, 0.474]],
      ['4 or more', '125', [0.087, 0.121], [0.164, 0.257]],
    ];
    root.innerHTML = G.map((g) => `<div class="grp"><div class="grp-bars"><div class="vbar"><span></span></div><div class="vbar ours"><span></span></div></div><div class="grp-label">${g[0]}<small>${g[1]}</small><em></em></div></div>`).join('');
    function render(metric) {
      $$('.grp', root).forEach((el, i) => {
        const v = G[i][metric === '50' ? 2 : 3];
        const bars = $$('.vbar', el);
        bars.forEach((b, j) => { b.style.height = (v[j] / 0.9 * 100) + '%'; $('span', b).textContent = v[j].toFixed(3); });
        $('em', el).textContent = `+${((v[1] / v[0] - 1) * 100).toFixed(1)}%`;
      });
    }
    seg($('#mult-metric'), render);
    render('50');
  })();

  /* ------------------------------------------------ 7. where the misses come from */
  (function miss() {
    const root = $('#miss');
    if (!root) return;
    const KEYS = [
      ['mask', 'm-mask', 'Mask quality', 'a center inside the site was selected, but no surviving mask reached IoU 0.5 with it'],
      ['nom', 'm-nom', 'Never nominated', 'no residue inside the site cleared τ<sub>q</sub>'],
      ['sel', 'm-sel', 'Select, other', 'a residue inside the site cleared τ<sub>q</sub>, but none survived the local-maximum test'],
      ['rho', 'm-rho', 'Select, close pair', 'none of its confident residues survived Select, and a surviving center lies in a different labelled site whose centroid is closer than ρ'],
      ['nms', 'm-nms', 'Suppress', 'a mask that would have matched the site was removed as a duplicate'],
    ];
    const D = [
      ['All sites', { gt: 3645, mask: 691, nom: 455, sel: 221, rho: 55, nms: 104 }],
      ['1 site', { gt: 1590, mask: 187, nom: 54, sel: 51, rho: 0, nms: 36 }],
      ['2 sites', { gt: 930, mask: 204, nom: 71, sel: 46, rho: 6, nms: 45 }],
      ['3 sites', { gt: 348, mask: 86, nom: 59, sel: 35, rho: 5, nms: 16 }],
      ['4 or more', { gt: 777, mask: 214, nom: 271, sel: 89, rho: 44, nms: 7 }],
    ];
    D.forEach((d) => { d[1].missed = KEYS.reduce((s, k) => s + d[1][k[0]], 0); });
    let mode = 'gt', pinned = null;
    const rowsEl = $('#miss-rows');
    rowsEl.innerHTML = D.map((d, i) => `<div class="stack-row"><div class="name"><b>${d[0]}</b><small>${d[1].gt.toLocaleString('en-US')} labelled</small></div><div class="stack" data-i="${i}">${KEYS.map((k) => `<div class="${k[1]}" data-k="${k[0]}" tabindex="0"></div>`).join('')}<div class="m-hit"></div></div></div>`).join('');
    const detail = $('#miss-detail');
    const base = 'Hover or tap a segment for the count and its definition.';
    function describe(i, key) {
      const d = D[i][1], k = KEYS.find((x) => x[0] === key);
      const n = d[key];
      return `<b>${D[i][0]} · ${k[2]}:</b> ${n.toLocaleString('en-US')} of ${d.missed.toLocaleString('en-US')} missed sites (${(n / d.missed * 100).toFixed(1)}%), ${(n / d.gt * 100).toFixed(1)}% of all labelled sites in this group. Counted when ${k[3]}.`;
    }
    function render() {
      $$('.stack', rowsEl).forEach((st) => {
        const d = D[+st.dataset.i][1];
        const tot = mode === 'gt' ? d.gt : d.missed;
        $$('[data-k]', st).forEach((sg) => {
          const n = d[sg.dataset.k], pct = n / tot * 100;
          sg.style.width = pct + '%';
          sg.textContent = pct >= 7 ? (mode === 'gt' ? n : pct.toFixed(0) + '%') : '';
          sg.setAttribute('aria-label', `${KEYS.find((x) => x[0] === sg.dataset.k)[2]}: ${n}`);
        });
        const hit = $('.m-hit', st);
        hit.style.width = mode === 'gt' ? ((d.gt - d.missed) / d.gt * 100) + '%' : '0%';
        hit.textContent = mode === 'gt' ? `found ${((d.gt - d.missed) / d.gt * 100).toFixed(0)}%` : '';
      });
    }
    function focus(i, key) {
      $$('[data-k]', rowsEl).forEach((sg) => sg.classList.toggle('fade', key != null && sg.dataset.k !== key));
      detail.innerHTML = key == null ? base : describe(i, key);
    }
    $$('[data-k]', rowsEl).forEach((sg) => {
      const i = +sg.parentNode.dataset.i, key = sg.dataset.k;
      sg.addEventListener('pointerenter', () => focus(i, key));
      sg.addEventListener('focus', () => focus(i, key));
      sg.addEventListener('click', () => { pinned = [i, key]; focus(i, key); });
      sg.addEventListener('pointerleave', () => (pinned ? focus(pinned[0], pinned[1]) : focus(0, null)));
      sg.addEventListener('blur', () => (pinned ? focus(pinned[0], pinned[1]) : focus(0, null)));
    });
    seg($('#miss-mode'), (v) => { mode = v; render(); });
    detail.innerHTML = base;
    render();
  })();

  /* ------------------------------------------------ 8. duplicate-suppression sweep */
  (function nms() {
    const svg = $('#nms-chart');
    if (!svg) return;
    const X = ['0.5', '0.6', '0.7', '0.8', '0.9', 'off'];
    const S = { ap50: [0.4674, 0.4700, 0.4717, 0.4698, 0.4604, 0.4514], ap30: [0.6237, 0.6205, 0.6145, 0.6052, 0.5894, 0.5748] };
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs, text) => {
      const n = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
      if (text != null) n.textContent = text;
      svg.appendChild(n);
      return n;
    };
    function draw() {
      svg.innerHTML = '';
      const W = 520, H = 250, L = 62, R = 78, T = 16, B = 40;
      const ink = css('--ink'), muted = css('--muted'), line = css('--line'), teal = css('--teal'), amber = css('--amber'), surf = css('--surface');
      const x = (i) => L + i * (W - L - R) / (X.length - 1), y = (v) => T + (0.66 - v) / (0.66 - 0.42) * (H - T - B);
      [0.45, 0.50, 0.55, 0.60, 0.65].forEach((v) => {
        mk('line', { x1: L - 16, x2: W - R, y1: y(v), y2: y(v), stroke: line, 'stroke-width': 1 });
        mk('text', { x: L - 22, y: y(v) + 3.5, 'text-anchor': 'end', 'font-size': 10.5, fill: muted, 'font-family': 'IBM Plex Mono, monospace' }, v.toFixed(2));
      });
      X.forEach((t, i) => mk('text', { x: x(i), y: H - B + 17, 'text-anchor': 'middle', 'font-size': 10.5, fill: i === 0 ? ink : muted, 'font-weight': i === 0 ? 600 : 400, 'font-family': 'IBM Plex Mono, monospace' }, t));
      mk('text', { x: (L + W - R) / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 11, fill: muted, 'font-family': 'Archivo, sans-serif' }, 'duplicate IoU threshold (0.5 is the value used in the paper)');
      [['ap30', amber, 'AP@0.3'], ['ap50', teal, 'AP@0.5']].forEach(([k, c, name]) => {
        mk('polyline', { points: S[k].map((v, i) => `${x(i)},${y(v)}`).join(' '), fill: 'none', stroke: c, 'stroke-width': 2.4, 'stroke-linejoin': 'round' });
        S[k].forEach((v, i) => {
          mk('circle', { cx: x(i), cy: y(v), r: i === 0 ? 5 : 3.6, fill: i === 0 ? c : surf, stroke: c, 'stroke-width': 2 });
          const t = mk('title', {}, `${name} at threshold ${X[i]}: ${v.toFixed(4)}`);
          svg.lastChild.previousSibling.appendChild(t);
        });
        mk('text', { x: W - R + 10, y: y(S[k][5]) + 4, 'font-size': 11.5, 'font-weight': 600, fill: c, 'font-family': 'Archivo, sans-serif' }, name);
        mk('text', { x: x(0) + 4, y: y(S[k][0]) - 11, 'text-anchor': 'middle', 'font-size': 10.5, fill: ink, 'font-family': 'IBM Plex Mono, monospace' }, S[k][0].toFixed(4));
        mk('text', { x: x(5), y: y(S[k][5]) + 17, 'text-anchor': 'middle', 'font-size': 10.5, fill: ink, 'font-family': 'IBM Plex Mono, monospace' }, S[k][5].toFixed(4));
      });
    }
    onTheme(draw);
    draw();
  })();

  /* ------------------------------------------------ page chrome: theme toggle, contents rail, copy */
  (function chrome() {
    const btn = $('#theme-btn');
    if (btn) {
      const cur = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const paint = () => { btn.textContent = cur() === 'dark' ? 'Light' : 'Dark'; btn.setAttribute('aria-label', `Switch to ${cur() === 'dark' ? 'light' : 'dark'} theme`); };
      btn.addEventListener('click', () => {
        const next = cur() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem('equisite-theme', next); } catch (e) { /* storage unavailable */ }
        paint();
      });
      paint();
    }
    const links = $$('.rail a');
    if (links.length && 'IntersectionObserver' in window) {
      const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting) { links.forEach((a) => a.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); }
        });
      }, { rootMargin: '-15% 0px -75% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
    const copy = $('#copy-bib');
    if (copy) copy.addEventListener('click', () => {
      const text = $('#bibtex').textContent;
      const done = () => { copy.textContent = 'Copied'; setTimeout(() => { copy.textContent = 'Copy BibTeX'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => {});
    });
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
        throwOnError: false,
      });
    }
  })();
})();
