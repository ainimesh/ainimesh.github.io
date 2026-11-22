/* EquiSite project page — protein viewer, in-browser decode, and the three widgets built on them.
   Everything here runs on real model outputs exported by tools/export_data.py (assets/js/data.js). */
(() => {
  'use strict';
  const DATA = window.EQUISITE;
  if (!DATA) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (x, d = 2) => x.toFixed(d);
  const SITE_LETTERS = 'ABCDEFGHIJKLMNOP';
  const AA3 = { A: 'ALA', R: 'ARG', N: 'ASN', D: 'ASP', C: 'CYS', Q: 'GLN', E: 'GLU', G: 'GLY', H: 'HIS', I: 'ILE', L: 'LEU', K: 'LYS', M: 'MET', F: 'PHE', P: 'PRO', S: 'SER', T: 'THR', W: 'TRP', Y: 'TYR', V: 'VAL', U: 'SEC', O: 'PYL', X: 'UNK' };

  /* ---------------------------------------------------------------- theme */
  let TH = null;
  const themeListeners = [];
  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    TH = {
      bg: g('--bg'), surface: g('--surface'), ink: g('--ink'), ink2: g('--ink-2'), muted: g('--muted'),
      line: g('--line'), teal: g('--teal'), amber: g('--amber'), slate: g('--slate'), res: g('--res'), bond: g('--bond'),
      sites: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => g('--s' + i)),
    };
  }
  function themeChanged() { readTheme(); themeListeners.forEach((f) => f()); }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChanged);
  new MutationObserver(themeChanged).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  readTheme();

  function rgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    const A = rgb(a), B = rgb(b);
    t = clamp(t, 0, 1);
    return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
  }

  /* ---------------------------------------------------------------- data */
  function buf(s) {
    const b = atob(s);
    const u = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return u.buffer;
  }
  function dist(P, i, j) {
    const a = P.xyz;
    const dx = a[3 * i] - a[3 * j], dy = a[3 * i + 1] - a[3 * j + 1], dz = a[3 * i + 2] - a[3 * j + 2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  function prep(P) {
    if (P.ready) return P;
    const N = P.N;
    P.xyz = new Float32Array(buf(P.xyz));
    P.q = new Float32Array(buf(P.q));
    P.p = new Float32Array(buf(P.p));
    P.vote = new Float32Array(buf(P.vote));
    P.mp = new Uint16Array(buf(P.mp));
    P.rowOf = new Int32Array(N).fill(-1);
    P.rows.forEach((r, k) => { P.rowOf[r] = k; });
    let R = 0;
    for (let i = 0; i < N; i++) R = Math.max(R, Math.hypot(P.xyz[3 * i], P.xyz[3 * i + 1], P.xyz[3 * i + 2]));
    P.R = R;
    P.bonds = [];
    for (let i = 0; i < N - 1; i++) if (dist(P, i, i + 1) < 4.3) P.bonds.push(i);
    P.sitesOf = Array.from({ length: N }, () => []);
    P.gt.forEach((g, k) => g.forEach((i) => P.sitesOf[i].push(k)));
    P.gtSet = P.gt.map((g) => { const u = new Uint8Array(N); g.forEach((i) => { u[i] = 1; }); return u; });
    P.anchorOf = new Int32Array(N).fill(-1);
    P.anchors.forEach((a, k) => { P.anchorOf[a] = k; });
    // vote targets: offset to the centroid of the containing site whose centroid is nearest
    P.owner = new Int32Array(N).fill(-1);
    for (let i = 0; i < N; i++) {
      let best = Infinity;
      for (const k of P.sitesOf[i]) {
        const c = P.centroids[k];
        const d = Math.hypot(c[0] - P.xyz[3 * i], c[1] - P.xyz[3 * i + 1], c[2] - P.xyz[3 * i + 2]);
        if (d < best) { best = d; P.owner[i] = k; }
      }
    }
    P.name = (i) => {
      let t = P.resn.substr(3 * i, 3).trim();
      if (t.length === 1) t = AA3[t] || t;
      return t.charAt(0) + t.slice(1).toLowerCase() + ' ' + P.resi[i];
    };
    P.ready = true;
    return P;
  }

  /* ---------------------------------------------------------------- decode (mirrors method/center_head.py) */
  function decode(P, t) {
    const N = P.N, q = P.q, S = DATA.mpScale;
    const isAbove = new Uint8Array(N), beatenBy = new Int32Array(N).fill(-1);
    const above = [];
    for (let i = 0; i < N; i++) if (q[i] > t.tq) { above.push(i); isAbove[i] = 1; }
    let centers = [];
    if (above.length <= 1 || t.rho <= 0) centers = above.slice();
    else {
      for (const i of above) {
        let best = -Infinity, by = -1;
        for (let j = 0; j < N; j++) {
          if (j === i) continue;
          if (q[j] > best && dist(P, i, j) <= t.rho) { best = q[j]; by = j; }
        }
        if (q[i] >= best) centers.push(i); else beatenBy[i] = by;
      }
    }
    let fallback = false;
    if (!centers.length) {
      let im = 0;
      for (let i = 1; i < N; i++) if (q[i] > q[im]) im = i;
      centers = [im]; fallback = true;
    }
    const thr = Math.round(t.tm * S);
    const sites = centers.map((c) => {
      const base = P.rowOf[c] * N;
      const set = new Uint8Array(N);
      let sum = 0, size = 0;
      for (let j = 0; j < N; j++) {
        const u = P.mp[base + j];
        if (u > thr || j === c) { set[j] = 1; size++; sum += u / S; }
      }
      return { c, set, size, score: q[c] * sum / size, kept: false, by: -1, rank: 0 };
    });
    const iou = (a, b) => {
      let inter = 0, uni = 0;
      for (let j = 0; j < N; j++) { const x = a.set[j], y = b.set[j]; if (x & y) inter++; if (x | y) uni++; }
      return inter / Math.max(uni, 1);
    };
    const order = sites.map((_, i) => i).sort((a, b) => sites[b].score - sites[a].score);
    const dead = new Uint8Array(sites.length);
    const kept = [];
    for (const i of order) {
      if (dead[i]) continue;
      sites[i].kept = true; kept.push(i);
      if (t.tnms >= 1) continue;
      for (const j of order) {
        if (j === i || dead[j] || sites[j].kept) continue;
        if (iou(sites[i], sites[j]) >= t.tnms) { dead[j] = 1; sites[j].by = i; }
      }
    }
    const centerIdx = new Int32Array(N).fill(-1);
    sites.forEach((s, k) => { centerIdx[s.c] = k; });
    // compare with the labelled sites: score order, one-to-one, IoU >= 0.5 (the AP@0.5 criterion)
    const found = new Array(P.K).fill(-1), bestIoU = new Array(P.K).fill(0);
    kept.forEach((si, r) => {
      const s = sites[si];
      s.rank = r + 1; s.gt = -1; s.iou = 0; s.tp = false;
      for (let k = 0; k < P.K; k++) {
        let inter = 0, uni = 0;
        const g = P.gtSet[k];
        for (let j = 0; j < N; j++) { const x = s.set[j], y = g[j]; if (x & y) inter++; if (x | y) uni++; }
        const v = inter / Math.max(uni, 1);
        if (v > s.iou) { s.iou = v; s.gt = k; }
        if (v > bestIoU[k]) bestIoU[k] = v;
      }
      if (s.gt >= 0 && s.iou >= 0.5 && found[s.gt] < 0) { found[s.gt] = si; s.tp = true; }
    });
    return { above, isAbove, beatenBy, centers, centerIdx, fallback, sites, kept, found, bestIoU, nFound: found.filter((x) => x >= 0).length };
  }

  /* ---------------------------------------------------------------- viewer */
  class Viewer {
    constructor(canvas, opts = {}) {
      this.cv = canvas; this.ctx = canvas.getContext('2d'); this.opts = opts;
      this.M = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      this.zoom = 1; this.P = null; this.layer = null; this.hover = -1;
      this.w = 0; this.h = 0; this.dpr = 1; this.raf = 0; this.scale = 1;
      this.sx = new Float32Array(0); this.sy = new Float32Array(0); this.sz = new Float32Array(0); this.order = [];
      if (opts.interactive !== false) this.bind();
      new ResizeObserver(() => this.resize()).observe(canvas);
      themeListeners.push(() => this.draw());
      this.resize();
    }
    setProtein(P) {
      this.P = P;
      this.sx = new Float32Array(P.N); this.sy = new Float32Array(P.N); this.sz = new Float32Array(P.N);
      this.order = Array.from({ length: P.N }, (_, i) => i);
      this.hover = -1;
      this.draw();
    }
    setLayer(L) { this.layer = L; this.draw(); }
    resize() {
      const r = this.cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = r.width; this.h = r.height;
      this.cv.width = Math.round(r.width * this.dpr); this.cv.height = Math.round(r.height * this.dpr);
      this.drawNow();
    }
    rotate(ax, ay) {
      const m = this.M, cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      // Ry then Rx, applied on the left (screen axes)
      const r = [cy, 0, sy, sx * sy, cx, -sx * cy, -cx * sy, sx, cx * cy];
      const o = new Array(9);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) o[3 * i + j] = r[3 * i] * m[j] + r[3 * i + 1] * m[3 + j] + r[3 * i + 2] * m[6 + j];
      this.M = o;
      this.draw();
      if (this.opts.onRotate) this.opts.onRotate(this);
    }
    setM(M) { this.M = M.slice(); this.draw(); if (this.opts.onRotate) this.opts.onRotate(this); }
    apply(x, y, z) {
      const m = this.M;
      return [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z];
    }
    pt(x, y, z) {
      const v = this.apply(x, y, z);
      return [this.cx + v[0] * this.scale, this.cy - v[1] * this.scale, v[2]];
    }
    depth(z) { return clamp((z + this.P.R) / (2 * this.P.R), 0, 1); }
    draw() { if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.drawNow(); }); }
    drawNow() {
      const P = this.P, L = this.layer, ctx = this.ctx;
      if (!P || !L || !this.w) return;
      const d = this.dpr, N = P.N, m = this.M, a = P.xyz;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, this.w, this.h);
      const top = this.opts.top || 0, bottom = this.opts.bottom || 0;
      const availH = this.h - top - bottom;
      const sc = this.scale = 0.5 * Math.min(this.w, availH) * (this.opts.fit || 0.9) / P.R * this.zoom;
      const cx = this.cx = this.w / 2, cy = this.cy = top + availH / 2;
      const { sx, sy, sz } = this;
      for (let i = 0; i < N; i++) {
        const x = a[3 * i], y = a[3 * i + 1], z = a[3 * i + 2];
        sx[i] = cx + (m[0] * x + m[1] * y + m[2] * z) * sc;
        sy[i] = cy - (m[3] * x + m[4] * y + m[5] * z) * sc;
        sz[i] = m[6] * x + m[7] * y + m[8] * z;
      }
      ctx.lineCap = 'round';
      ctx.lineWidth = clamp(sc * 0.32, 1, 2.2);
      ctx.strokeStyle = TH.bond;
      for (const i of P.bonds) {
        ctx.globalAlpha = 0.3 + 0.55 * this.depth((sz[i] + sz[i + 1]) / 2);
        ctx.beginPath(); ctx.moveTo(sx[i], sy[i]); ctx.lineTo(sx[i + 1], sy[i + 1]); ctx.stroke();
      }
      this.order.sort((p, r) => sz[p] - sz[r]);
      const base = this.base = clamp(sc * 1.45, 2.2, 8.5);
      for (const i of this.order) {
        const s = L.style(i);
        const dep = this.depth(sz[i]);
        const r = base * (s.r || 1) * (0.82 + 0.3 * dep);
        ctx.globalAlpha = (s.alpha == null ? 1 : s.alpha) * (0.42 + 0.58 * dep);
        ctx.fillStyle = s.fill;
        ctx.beginPath(); ctx.arc(sx[i], sy[i], r, 0, 6.2832); ctx.fill();
        if (s.outer) {
          ctx.lineWidth = 1.6; ctx.strokeStyle = s.outer;
          ctx.beginPath(); ctx.arc(sx[i], sy[i], r + 1.8, 0, 6.2832); ctx.stroke();
        }
        if (s.ring) {
          ctx.globalAlpha = 0.55 + 0.45 * dep;
          ctx.lineWidth = s.ringW || 1.5; ctx.strokeStyle = s.ring;
          if (s.dash) ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.arc(sx[i], sy[i], r + (s.outer ? 4.6 : 2.6), 0, 6.2832); ctx.stroke();
          if (s.dash) ctx.setLineDash([]);
        }
      }
      ctx.globalAlpha = 1;
      if (L.overlay) L.overlay(ctx, this);
    }
    pick(e) {
      const r = this.cv.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      let best = -1, bz = -Infinity;
      const lim = Math.max(10, this.base + 4);
      for (let i = 0; i < this.P.N; i++) {
        const dx = this.sx[i] - mx, dy = this.sy[i] - my;
        if (dx * dx + dy * dy < lim * lim && this.sz[i] > bz) { bz = this.sz[i]; best = i; }
      }
      return best;
    }
    showTip(i) {
      const tip = this.opts.tip;
      if (!tip) return;
      const html = i >= 0 && this.layer.tip ? this.layer.tip(i) : null;
      if (!html) { tip.classList.remove('on'); return; }
      tip.innerHTML = html;
      const tw = tip.offsetWidth, th = tip.offsetHeight, x = this.sx[i];
      let left = x + 12;
      if (left + tw > this.w - 4) left = x - 12 - tw;
      if (left < 4) left = clamp(this.w - tw - 4, 4, Math.max(4, x + 12));
      tip.style.left = left + 'px';
      tip.style.top = clamp(this.sy[i] - th / 2, 4, Math.max(4, this.h - th - 4)) + 'px';
      tip.classList.add('on');
    }
    bind() {
      const cv = this.cv;
      let drag = null, moved = 0;
      cv.addEventListener('pointerdown', (e) => {
        drag = { x: e.clientX, y: e.clientY }; moved = 0;
        try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        if (this.opts.onInteract) this.opts.onInteract();
      });
      cv.addEventListener('pointermove', (e) => {
        if (!this.P) return;
        if (drag) {
          const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
          drag.x = e.clientX; drag.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
          if (moved > 3) { this.rotate(dy * 0.01, dx * 0.01); this.showTip(-1); }
        } else if (e.pointerType !== 'touch') {
          const i = this.pick(e);
          if (i !== this.hover) { this.hover = i; this.drawNow(); }
          this.showTip(i);
        }
      });
      cv.addEventListener('pointerup', (e) => {
        if (drag && moved <= 3) {
          const i = this.pick(e);
          if (e.pointerType === 'touch') { this.hover = i; this.drawNow(); this.showTip(i); }
          if (i >= 0 && this.layer && this.layer.click) this.layer.click(i);
        }
        drag = null;
      });
      cv.addEventListener('pointercancel', () => { drag = null; });
      cv.addEventListener('pointerleave', () => { if (!drag) { this.hover = -1; this.showTip(-1); this.draw(); } });
      cv.addEventListener('keydown', (e) => {
        const k = { ArrowLeft: [0, -0.12], ArrowRight: [0, 0.12], ArrowUp: [-0.12, 0], ArrowDown: [0.12, 0] }[e.key];
        if (k) { e.preventDefault(); this.rotate(k[0], k[1]); if (this.opts.onInteract) this.opts.onInteract(); }
      });
    }
  }

  function arrow(ctx, x0, y0, x1, y1, head) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    if (len < 1.5) return;
    const ux = dx / len, uy = dy / len, h = Math.min(head, len * 0.45);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * h - uy * h * 0.5, y1 - uy * h + ux * h * 0.5);
    ctx.lineTo(x1 - ux * h + uy * h * 0.5, y1 - uy * h - ux * h * 0.5);
    ctx.closePath(); ctx.fill();
  }
  function label(ctx, text, x, y) {
    ctx.font = '600 11px Archivo, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 3; ctx.strokeStyle = TH.surface; ctx.strokeText(text, x, y);
    ctx.fillStyle = TH.ink; ctx.fillText(text, x, y);
  }

  /* ---------------------------------------------------------------- layers: what each stage draws */
  function buildLayer(P, dec, st, api = {}) {
    const N = P.N, S = DATA.mpScale;
    const L = {};
    const siteColor = (k) => TH.sites[k % 8];

    if (st.stage === 'gt') {
      L.style = (i) => {
        const ks = P.sitesOf[i];
        if (!ks.length) return { fill: TH.res, r: 0.75 };
        const anchor = P.anchorOf[i] >= 0;
        return { fill: siteColor(ks[0]), r: anchor ? 1.5 : 1.1, ring: anchor ? TH.ink : null, ringW: 2, outer: ks.length > 1 ? siteColor(ks[1]) : null };
      };
      L.overlay = (ctx, v) => {
        if (st.targets) {
          ctx.lineWidth = 1.1;
          for (let i = 0; i < N; i++) {
            const k = P.owner[i];
            if (k < 0) continue;
            const c = P.centroids[k], e = v.pt(c[0], c[1], c[2]);
            ctx.globalAlpha = 0.55; ctx.strokeStyle = ctx.fillStyle = siteColor(k);
            arrow(ctx, v.sx[i], v.sy[i], e[0], e[1], 5);
          }
          ctx.globalAlpha = 1;
        }
        P.centroids.forEach((c, k) => {
          const e = v.pt(c[0], c[1], c[2]);
          ctx.lineWidth = 4; ctx.strokeStyle = TH.surface;
          for (let pass = 0; pass < 2; pass++) {
            ctx.beginPath(); ctx.moveTo(e[0] - 5, e[1] - 5); ctx.lineTo(e[0] + 5, e[1] + 5);
            ctx.moveTo(e[0] - 5, e[1] + 5); ctx.lineTo(e[0] + 5, e[1] - 5); ctx.stroke();
            ctx.lineWidth = 2; ctx.strokeStyle = TH.ink;
          }
          const a = P.anchors[k];
          label(ctx, 'site ' + SITE_LETTERS[k], v.sx[a], v.sy[a] - v.base * 1.6 - 11);
        });
      };
      L.tip = (i) => {
        const ks = P.sitesOf[i];
        if (!ks.length) return `${P.name(i)} · not in a site`;
        const k = P.anchorOf[i];
        if (k >= 0) {
          const c = P.centroids[k];
          const d = Math.hypot(c[0] - P.xyz[3 * i], c[1] - P.xyz[3 * i + 1], c[2] - P.xyz[3 * i + 2]);
          return `${P.name(i)} · <b>anchor of site ${SITE_LETTERS[k]}</b><br>${fmt(d, 1)} Å from its centroid`;
        }
        return `${P.name(i)} · in site ${ks.map((x) => SITE_LETTERS[x]).join(' and ')}`;
      };
      return L;
    }

    if (st.stage === 'nominate') {
      const val = st.mode === 'p' ? P.p : P.q;
      L.style = (i) => ({ fill: mix(TH.res, TH.teal, Math.pow(val[i], 0.85)), r: 0.72 + 0.75 * val[i] });
      L.overlay = (ctx, v) => {
        if (!st.votes) return;
        ctx.lineWidth = 1.3; ctx.strokeStyle = ctx.fillStyle = TH.amber; ctx.globalAlpha = 0.85;
        for (let i = 0; i < N; i++) {
          if (P.p[i] <= 0.5) continue;
          const e = v.pt(P.xyz[3 * i] + P.vote[3 * i], P.xyz[3 * i + 1] + P.vote[3 * i + 1], P.xyz[3 * i + 2] + P.vote[3 * i + 2]);
          arrow(ctx, v.sx[i], v.sy[i], e[0], e[1], 5.5);
        }
        ctx.globalAlpha = 1;
      };
      L.tip = (i) => `${P.name(i)}<br>centerness q = ${fmt(P.q[i])}<br>objectness p = ${fmt(P.p[i])}<br>|vote| = ${fmt(Math.hypot(P.vote[3 * i], P.vote[3 * i + 1], P.vote[3 * i + 2]), 1)} Å`;
      return L;
    }

    if (st.stage === 'select') {
      L.style = (i) => {
        if (dec.centerIdx[i] >= 0) return { fill: TH.teal, r: 1.5, ring: TH.ink, ringW: 2 };
        if (dec.isAbove[i]) return { fill: mix(TH.res, TH.teal, 0.5), r: 1.0 };
        return { fill: TH.res, r: 0.7 };
      };
      L.overlay = (ctx, v) => {
        const i = v.hover;
        if (i < 0 || !dec.isAbove[i] || st.rho <= 0) return;
        ctx.setLineDash([4, 4]); ctx.lineWidth = 1.3; ctx.strokeStyle = TH.ink2;
        ctx.beginPath(); ctx.arc(v.sx[i], v.sy[i], st.rho * v.scale, 0, 6.2832); ctx.stroke();
        ctx.setLineDash([]);
        const b = dec.beatenBy[i];
        if (b >= 0) {
          ctx.strokeStyle = ctx.fillStyle = TH.amber; ctx.lineWidth = 1.6;
          arrow(ctx, v.sx[i], v.sy[i], v.sx[b], v.sy[b], 7);
        }
      };
      L.tip = (i) => {
        const q = fmt(P.q[i]);
        if (dec.centerIdx[i] >= 0) return dec.fallback
          ? `${P.name(i)} · q = ${q}<br><b>kept as fallback</b> (highest q)`
          : `${P.name(i)} · q = ${q}<br><b>selected</b>: highest q within ρ`;
        if (dec.isAbove[i]) {
          const b = dec.beatenBy[i];
          return `${P.name(i)} · q = ${q}<br>outscored by ${P.name(b)} (q = ${fmt(P.q[b])}), ${fmt(dist(P, i, b), 1)} Å away`;
        }
        return `${P.name(i)} · q = ${q}<br>below τ<sub>q</sub>`;
      };
      return L;
    }

    if (st.stage === 'delineate') {
      const s = dec.sites[clamp(st.active, 0, dec.sites.length - 1)];
      const row = P.rowOf[s.c] * N;
      L.style = (i) => {
        const pr = P.mp[row + i] / S;
        if (i === s.c) return { fill: TH.teal, r: 1.55, ring: TH.ink, ringW: 2 };
        const other = dec.centerIdx[i] >= 0;
        if (s.set[i]) return { fill: mix(TH.res, TH.teal, 0.4 + 0.6 * pr), r: 1.15, ring: other ? TH.muted : null, ringW: 1.4 };
        return { fill: mix(TH.res, TH.teal, 0.3 * pr), r: 0.75, ring: other ? TH.muted : null, ringW: 1.4 };
      };
      L.tip = (i) => {
        const pr = P.mp[row + i] / S;
        const extra = dec.centerIdx[i] >= 0 && i !== s.c ? '<br>another center — click to view its mask' : '';
        if (i === s.c) return `${P.name(i)} · <b>center</b> (q = ${fmt(P.q[i])})`;
        return `${P.name(i)}<br>σ(u) = ${fmt(pr)} → ${s.set[i] ? '<b>in the mask</b>' : 'outside'}${extra}`;
      };
      L.click = (i) => { if (dec.centerIdx[i] >= 0 && api.setActive) api.setActive(dec.centerIdx[i]); };
      return L;
    }

    // final sites, after Suppress
    const owner = new Int32Array(N).fill(-1);
    for (let r = dec.kept.length - 1; r >= 0; r--) {
      const si = dec.kept[r], set = dec.sites[si].set;
      for (let j = 0; j < N; j++) if (set[j]) owner[j] = si;
    }
    const col = (s) => (s.tp ? siteColor(s.gt) : TH.slate);
    L.style = (i) => {
      const o = owner[i];
      const out = o < 0 ? { fill: TH.res, r: 0.72 } : { fill: col(dec.sites[o]), r: 1.1, alpha: dec.sites[o].tp ? 1 : 0.85 };
      const ci = dec.centerIdx[i];
      if (ci >= 0) {
        if (dec.sites[ci].kept) { out.ring = TH.ink; out.ringW = 2; out.r = 1.4; }
        else { out.ring = TH.muted; out.ringW = 1.3; out.dash = true; }
      }
      if (st.outline && P.sitesOf[i].length) out.outer = siteColor(P.sitesOf[i][0]);
      return out;
    };
    L.overlay = (ctx, v) => {
      if (st.noLabels) return;
      dec.kept.slice(0, 12).forEach((si) => {
        const s = dec.sites[si];
        label(ctx, String(s.rank), v.sx[s.c], v.sy[s.c] - v.base * 1.5 - 10);
      });
    };
    L.tip = (i) => {
      const o = owner[i], ci = dec.centerIdx[i];
      let t = P.name(i);
      if (ci >= 0) {
        const s = dec.sites[ci];
        t += s.kept ? ` · <b>center of prediction ${s.rank}</b>` : ` · center, suppressed as a duplicate of prediction ${dec.sites[s.by].rank}`;
      }
      t += o >= 0 ? `<br>in prediction ${dec.sites[o].rank} (score ${fmt(dec.sites[o].score)})` : '<br>not in any predicted site';
      if (P.sitesOf[i].length) t += `<br>labelled: site ${P.sitesOf[i].map((x) => SITE_LETTERS[x]).join(' and ')}`;
      return t;
    };
    return L;
  }

  const NOTES = {
    Q939U1: 'Two well-separated sites. Nine residues survive Select and seven masks survive Suppress; the two labelled sites are the two top-scoring predictions.',
    P84078: 'A single site. One residue clears both tests in Select, and its mask matches the labelled site exactly.',
    Q5NGQ3: 'Two sites that share residues, 9.4 Å apart. Five centers are selected; Suppress merges them into exactly two masks.',
    H2FH31: 'Three separate sites, all recovered, followed by three low-score extras.',
    Q9LLQ2: 'Five small sites packed within 7 to 15 Å of each other. The paper’s values find three. Try ρ = 4 Å with τ<sub>nms</sub> = 0.70: all five appear, among four times as many predictions.',
  };
  const proteins = DATA.proteins.map(prep);
  const DEF = DATA.defaults;
  const defaults = () => ({ tq: DEF.tq, rho: DEF.rho, tm: DEF.tm, tnms: DEF.tnms });

  /* ---------------------------------------------------------------- hero */
  (function hero() {
    const cv = $('#hero-canvas');
    if (!cv) return;
    const P = proteins[0];
    const dec = decode(P, defaults());
    const steps = $$('.hero-step');
    const stages = ['nominate', 'select', 'delineate', 'sites'];
    let cur = 0, auto = !reduceMotion, visible = true, userRot = false;
    const v = new Viewer(cv, { fit: 0.94, onInteract: () => { userRot = true; } });
    v.setProtein(P);
    function show(k) {
      cur = k;
      steps.forEach((b, i) => b.classList.toggle('on', i === k));
      const st = { stage: stages[k], mode: 'q', votes: true, active: dec.kept[0], rho: DEF.rho, noLabels: false };
      v.setLayer(buildLayer(P, dec, st));
    }
    steps.forEach((b, i) => b.addEventListener('click', () => { auto = false; show(i); }));
    $('#hero-n').textContent = `${dec.centers.length} centers`;
    $('#hero-k').textContent = `${dec.centers.length} → ${dec.kept.length} masks`;
    show(reduceMotion ? 3 : 0);
    themeListeners.push(() => show(cur));
    if (reduceMotion) return;
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(cv);
    let t0 = performance.now(), last = t0, acc = 0;
    (function tick(now) {
      const dt = now - last; last = now;
      if (visible && !document.hidden) {
        if (!userRot) {
          const a = 0.38 * Math.sin((now - t0) * 0.00035), b = 0.1 * Math.sin((now - t0) * 0.00022);
          const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
          v.M = [ca, 0, sa, sb * sa, cb, -sb * ca, -cb * sa, sb, cb * ca];
          v.draw();
        }
        if (auto) { acc += dt; if (acc > 3200) { acc = 0; show((cur + 1) % 4); } }
      }
      requestAnimationFrame(tick);
    })(t0);
  })();

  /* ---------------------------------------------------------------- decode explorer */
  (function explorer() {
    const root = $('#explorer');
    if (!root) return;
    const state = { pi: 0, stage: 'sites', mode: 'q', votes: true, targets: false, outline: false, active: 0, t: defaults() };
    let P = proteins[0], dec = null;
    const viewer = new Viewer($('#xp-canvas'), { tip: $('#xp-tip'), top: 34, bottom: 18, fit: 0.92 });
    const elx = {
      chips: $('#xp-proteins'), stages: $$('.xp-stage', root), explain: $('#xp-explain'), sub: $('#xp-sub'), legend: $('#xp-legend'),
      funnel: $('#xp-funnel'), sites: $('#xp-sites'), badge: $('#xp-badge'), reset: $('#xp-reset'), link: $('#xp-uniprot'), note: $('#xp-note'),
    };
    const sliders = {
      tq: { el: $('#sl-tq'), out: $('#out-tq'), show: (v) => fmt(v) },
      rho: { el: $('#sl-rho'), out: $('#out-rho'), show: (v) => (v <= 0 ? 'off' : v + ' Å') },
      tm: { el: $('#sl-tm'), out: $('#out-tm'), show: (v) => fmt(v) },
      tnms: { el: $('#sl-tnms'), out: $('#out-tnms'), show: (v) => (v >= 1 ? 'off' : fmt(v)) },
    };

    proteins.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = 'chip'; b.type = 'button';
      b.textContent = `${p.id} · ${p.label}`;
      b.addEventListener('click', () => { state.pi = i; setProtein(); });
      elx.chips.appendChild(b);
    });
    elx.stages.forEach((b) => b.addEventListener('click', () => { state.stage = b.dataset.stage; renderStage(); }));
    Object.entries(sliders).forEach(([k, s]) => {
      s.el.addEventListener('input', () => { state.t[k] = Math.round(parseFloat(s.el.value) * 100) / 100; recompute(); });
    });
    elx.reset.addEventListener('click', () => { state.t = defaults(); syncSliders(); recompute(); });

    function syncSliders() {
      Object.entries(sliders).forEach(([k, s]) => { s.el.value = state.t[k]; s.out.textContent = s.show(state.t[k]); });
    }
    function setProtein() {
      P = proteins[state.pi];
      $$('.chip', elx.chips).forEach((b, i) => b.setAttribute('aria-pressed', i === state.pi));
      elx.link.href = 'https://www.uniprot.org/uniprotkb/' + P.id + '/entry';
      elx.link.textContent = P.id + ' on UniProt ↗';
      elx.note.innerHTML = NOTES[P.id] || P.note;
      viewer.M = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      viewer.setProtein(P);
      state.active = -1;
      recompute();
    }
    function recompute() {
      Object.entries(sliders).forEach(([k, s]) => { s.out.textContent = s.show(state.t[k]); });
      dec = decode(P, state.t);
      if (state.active < 0 || state.active >= dec.sites.length) state.active = dec.kept[0];
      const isDef = ['tq', 'rho', 'tm', 'tnms'].every((k) => Math.abs(state.t[k] - DEF[k]) < 1e-9);
      elx.badge.textContent = isDef ? 'paper values' : 'modified';
      elx.badge.classList.toggle('off', !isDef);
      elx.reset.disabled = isDef;
      renderStage();
      renderFunnel();
      renderSites();
    }
    const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

    function renderStage() {
      const st = state.stage;
      elx.stages.forEach((b) => b.setAttribute('aria-pressed', b.dataset.stage === st));
      const dim = { gt: ['tq', 'rho', 'tm', 'tnms'], nominate: ['tq', 'rho', 'tm', 'tnms'], select: ['tm', 'tnms'], delineate: ['tnms'], sites: [] }[st];
      Object.entries(sliders).forEach(([k, s]) => s.el.closest('.sl').classList.toggle('dim', dim.includes(k)));
      let explain = '', sub = '', legend = '';
      const nC = dec.centers.length, nK = dec.kept.length;
      if (st === 'gt') {
        explain = `<b>What the model is trained on.</b> Each labelled site (one colour each) designates the member residue nearest its centroid (✕) as its <b>anchor</b> (ringed). The anchors are the only positives for the centerness score, so this protein has ${plural(P.K, 'positive')} among ${P.N} residues.`;
        sub = `<label class="check"><input type="checkbox" id="xp-targets" ${state.targets ? 'checked' : ''}> show vote targets (each site residue → its centroid)</label>`;
        legend = P.gt.map((_, k) => `<span><i class="dot" style="background:${TH.sites[k % 8]}"></i>site ${SITE_LETTERS[k]}</span>`).join('') + '<span><i class="dot ring"></i>anchor</span><span>✕ centroid</span>';
      } else if (st === 'nominate') {
        explain = `<b>Every residue scores itself</b>, in parallel. ${state.mode === 'q' ? 'Colour shows <b>centerness <i>q</i></b>: how much a residue looks like the anchor of a site. It rises smoothly across a pocket instead of spiking at one residue, which is why the next step is needed.' : 'Colour shows <b>objectness <i>p</i></b>: whether a residue lies in any site. It is trained as an auxiliary signal and is not used to decode.'}`;
        sub = `<div class="seg" role="group" aria-label="Colour by"><button type="button" data-mode="q" aria-pressed="${state.mode === 'q'}">centerness q</button><button type="button" data-mode="p" aria-pressed="${state.mode === 'p'}">objectness p</button></div><label class="check"><input type="checkbox" id="xp-votes" ${state.votes ? 'checked' : ''}> votes <b>v</b></label>`;
        legend = `<span>low <i class="ramp" style="background:linear-gradient(90deg, ${TH.res}, ${TH.teal})"></i> high ${state.mode}</span>` + (state.votes ? `<span style="color:${TH.amber}">→ vote of each residue with p &gt; 0.5</span>` : '');
      } else if (st === 'select') {
        explain = dec.fallback
          ? `<b>No residue clears τ<sub>q</sub></b>, so the decode falls back to the single residue with the highest <i>q</i> rather than return nothing.`
          : `<b>${plural(dec.above.length, 'residue')} clear${dec.above.length === 1 ? 's' : ''} τ<sub>q</sub>; ${nC} ${nC === 1 ? 'is a local maximum' : 'are local maxima'}.</b> A residue is kept only if no residue within ρ has a higher <i>q</i>. One pass, no iterations. Hover a pale-teal residue to see who outscored it.`;
        legend = `<span><i class="dot" style="background:${TH.teal};box-shadow:0 0 0 2px ${TH.surface},0 0 0 4px ${TH.ink}"></i>&nbsp;selected center</span><span><i class="dot" style="background:${mix(TH.res, TH.teal, 0.5)}"></i><span>above τ<sub>q</sub>, outscored</span></span><span><i class="dot"></i><span>below τ<sub>q</sub></span></span>`;
      } else if (st === 'delineate') {
        const s = dec.sites[state.active];
        explain = `<b>Each center paints its own mask.</b> Showing the center at ${P.name(s.c)}: ${plural(s.size, 'residue')} have σ(<i>u</i>) &gt; τ<sub>m</sub>, score ${fmt(s.score)}. The score is the center's <i>q</i> times the mean mask probability.`;
        const order = dec.sites.map((_, i) => i).sort((a, b) => dec.sites[b].score - dec.sites[a].score);
        sub = '<div class="chips">' + order.slice(0, 10).map((i) => `<button type="button" class="chip" data-site="${i}" aria-pressed="${i === state.active}">${P.name(dec.sites[i].c)} · ${fmt(dec.sites[i].score)}</button>`).join('') + (order.length > 10 ? `<span class="readout">+ ${order.length - 10} more (click their rings)</span>` : '') + '</div>';
        legend = `<span>σ(u): low <i class="ramp" style="background:linear-gradient(90deg, ${TH.res}, ${TH.teal})"></i> high</span><span><i class="dot ring"></i>this center</span><span><i class="dot" style="background:transparent;border:1.5px solid ${TH.muted}"></i>other centers</span>`;
      } else {
        const dropped = nC - nK;
        explain = `<b>${plural(nC, 'mask')} → ${plural(nK, 'predicted site')}.</b> ${dropped ? `Greedy NMS removed ${plural(dropped, 'mask')} that overlapped a higher-scoring one by IoU ≥ τ<sub>nms</sub>.` : 'No two masks overlap by IoU ≥ τ<sub>nms</sub>, so nothing is removed.'} Coloured predictions match a labelled site at IoU ≥ 0.5; grey ones do not. Numbers are score ranks.`;
        sub = `<label class="check"><input type="checkbox" id="xp-outline" ${state.outline ? 'checked' : ''}> outline the labelled sites</label>`;
        legend = P.gt.map((_, k) => `<span><i class="dot" style="background:${TH.sites[k % 8]}"></i>matches site ${SITE_LETTERS[k]}</span>`).join('') + `<span><i class="dot" style="background:${TH.slate}"></i>no match</span>`;
      }
      elx.explain.innerHTML = explain; elx.sub.innerHTML = sub; elx.legend.innerHTML = legend;
      const t = $('#xp-targets', elx.sub); if (t) t.addEventListener('change', () => { state.targets = t.checked; renderStage(); });
      const vv = $('#xp-votes', elx.sub); if (vv) vv.addEventListener('change', () => { state.votes = vv.checked; renderStage(); });
      const o = $('#xp-outline', elx.sub); if (o) o.addEventListener('change', () => { state.outline = o.checked; renderStage(); });
      $$('[data-mode]', elx.sub).forEach((b) => b.addEventListener('click', () => { state.mode = b.dataset.mode; renderStage(); }));
      $$('[data-site]', elx.sub).forEach((b) => b.addEventListener('click', () => { state.active = +b.dataset.site; renderStage(); }));
      viewer.setLayer(buildLayer(P, dec, { stage: st, mode: state.mode, votes: state.votes, targets: state.targets, outline: state.outline, active: state.active, rho: state.t.rho },
        { setActive: (i) => { state.active = i; renderStage(); } }));
    }
    function renderFunnel() {
      const cells = [
        [P.N, 'residues'],
        [dec.above.length, 'with q > τ<sub>q</sub>'],
        [dec.centers.length, dec.fallback ? 'center (fallback)' : `center${dec.centers.length === 1 ? '' : 's'} after Select`],
        [dec.kept.length, `site${dec.kept.length === 1 ? '' : 's'} after Suppress`],
        [`${dec.nFound} / ${P.K}`, 'labelled sites found (IoU ≥ 0.5)', 'hit'],
      ];
      elx.funnel.innerHTML = cells.map((c) => `<div class="${c[2] || ''}"><b>${c[0]}</b><span>${c[1]}</span></div>`).join('');
    }
    function renderSites() {
      const rows = dec.kept.slice(0, 8).map((si) => {
        const s = dec.sites[si];
        const g = s.gt >= 0 && s.iou > 0 ? `site ${SITE_LETTERS[s.gt]} · IoU ${fmt(s.iou)}` : '—';
        const cls = s.tp ? 'ok' : 'no';
        const sw = s.tp ? TH.sites[s.gt % 8] : TH.slate;
        return `<tr><td><i class="dot" style="background:${sw}"></i> ${s.rank}</td><td class="num">${fmt(s.score)}</td><td class="num">${s.size}</td><td>${P.name(s.c)}</td><td class="${cls}">${g}${s.tp ? ' ✓' : ''}</td></tr>`;
      }).join('');
      const more = dec.kept.length > 8 ? `<p class="sites-note">+ ${dec.kept.length - 8} lower-scoring predictions not listed.</p>` : '';
      const gts = P.gt.map((g, k) => (dec.found[k] >= 0
        ? `<span class="ok">site ${SITE_LETTERS[k]} found</span> (IoU ${fmt(dec.sites[dec.found[k]].iou)})`
        : `<span class="miss">site ${SITE_LETTERS[k]} missed</span> (best IoU ${fmt(dec.bestIoU[k])})`)).join(' · ');
      elx.sites.innerHTML = `<table><thead><tr><th>Rank</th><th>Score</th><th>Residues</th><th>Center</th><th>Best overlap with a labelled site</th></tr></thead><tbody>${rows}</tbody></table>${more}<p class="sites-note">${gts}</p>`;
    }
    themeListeners.push(() => { renderStage(); renderSites(); });
    syncSliders();
    setProtein();

    // expose for the parity test (tools/check_decode.py) and for curious readers
    window.EquiSiteDemo = { decode, proteins, defaults, state, viewer, current: () => dec, recompute: () => { syncSliders(); recompute(); } };
  })();

  /* ---------------------------------------------------------------- pose consistency */
  (function pose() {
    const root = $('#pose');
    if (!root) return;
    const P = proteins[0];
    const dec = decode(P, defaults());
    const top = dec.sites[dec.kept[0]];
    const st = { stage: 'nominate', mode: 'q', votes: true };
    function layer() {
      const L = buildLayer(P, dec, st);
      const base = L.style, over = L.overlay;
      L.style = (i) => { const s = base(i); if (dec.centerIdx[i] >= 0 && dec.sites[dec.centerIdx[i]].kept) { s.ring = TH.ink; s.ringW = i === top.c ? 2.4 : 1.4; } return s; };
      L.overlay = (ctx, v) => {
        over(ctx, v);
        // lab-frame axes: fixed, to show that it is the input that moves
        const x0 = 26, y0 = v.h - 26, len = 18;
        ctx.lineWidth = 1.4; ctx.strokeStyle = ctx.fillStyle = TH.muted; ctx.font = '500 10px "IBM Plex Mono", monospace';
        arrow(ctx, x0, y0, x0 + len, y0, 5); arrow(ctx, x0, y0, x0, y0 - len, 5);
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('x', x0 + len + 4, y0);
        ctx.textAlign = 'center'; ctx.fillText('y', x0, y0 - len - 8);
      };
      L.tip = null;
      return L;
    }
    const va = new Viewer($('#pose-a'), { interactive: false, top: 30, bottom: 8, fit: 0.9 });
    const vb = new Viewer($('#pose-b'), { top: 30, bottom: 8, fit: 0.9, onRotate: readout, onInteract: () => { anim = null; } });
    va.setProtein(P); vb.setProtein(P);
    const setLayers = () => { va.setLayer(layer()); vb.setLayer(layer()); };
    setLayers();
    themeListeners.push(() => { setLayers(); strips(); });

    const c = top.c;
    const vec = (a, i) => [a[3 * i], a[3 * i + 1], a[3 * i + 2]];
    const show = (v) => '(' + v.map((x) => (x >= 0 ? ' ' : '') + x.toFixed(1)).join(', ') + ')';
    function readout() {
      const vA = vec(P.vote, c), vB = vb.apply(vA[0], vA[1], vA[2]);
      $('#pose-res').textContent = P.name(c);
      $('#pose-qa').textContent = fmt(P.q[c], 3); $('#pose-qb').textContent = fmt(P.q[c], 3);
      $('#pose-va').textContent = show(vA) + ' Å'; $('#pose-vb').textContent = show(vB) + ' Å';
    }
    function strips() {
      ['#strip-a', '#strip-b'].forEach((id) => {
        const cv = $(id), r = cv.getBoundingClientRect();
        if (!r.width) return;
        const d = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
        const ctx = cv.getContext('2d');
        const w = cv.width / P.N;
        for (let i = 0; i < P.N; i++) {
          ctx.fillStyle = mix(TH.res, TH.teal, Math.pow(P.q[i], 0.85));
          ctx.fillRect(Math.floor(i * w), 0, Math.ceil(w), cv.height);
        }
      });
    }
    new ResizeObserver(strips).observe($('#strip-a'));
    let anim = null;
    function animateTo(axis, angle) {
      if (reduceMotion) { stepAxis(axis, angle); return; }
      const t0 = performance.now(), dur = 900; let done = 0;
      anim = {};
      const mine = anim;
      (function tick(now) {
        if (anim !== mine) return;
        const u = clamp((now - t0) / dur, 0, 1), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        stepAxis(axis, angle * (e - done)); done = e;
        if (u < 1) requestAnimationFrame(tick);
      })(t0);
    }
    function stepAxis(k, th) {
      // rotation by th about unit axis k (Rodrigues), applied on the left
      const [x, y, z] = k, cc = Math.cos(th), s = Math.sin(th), C = 1 - cc;
      const r = [cc + x * x * C, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, cc + y * y * C, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, cc + z * z * C];
      const m = vb.M, o = new Array(9);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) o[3 * i + j] = r[3 * i] * m[j] + r[3 * i + 1] * m[3 + j] + r[3 * i + 2] * m[6 + j];
      vb.setM(o);
    }
    $('#pose-random').addEventListener('click', () => {
      let k = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
      const n = Math.hypot(k[0], k[1], k[2]) || 1; k = k.map((x) => x / n);
      animateTo(k, 1.2 + Math.random() * 1.6);
    });
    $('#pose-reset').addEventListener('click', () => { anim = null; vb.setM([1, 0, 0, 0, 1, 0, 0, 0, 1]); });
    vb.setM([0.5, 0, 0.866, 0.433, 0.866, -0.25, -0.75, 0.5, 0.433]);
    readout(); strips();

    const R = DATA.rotation;
    if (R) {
      const sci = (x) => { const e = Math.floor(Math.log10(x)); return `${(x / Math.pow(10, e)).toFixed(1)} × 10<sup>${e < 0 ? '−' + (-e) : e}</sup>`; };
      const ints = ['n', 'flips', 'same_sites', 'same_sites_noflip'];
      $$('[data-rot]').forEach((n) => {
        const k = n.dataset.rot;
        if (R[k] == null) return;
        n.innerHTML = ints.includes(k) ? R[k].toLocaleString('en-US') : k === 'flip_q_max' ? R[k].toFixed(2) : sci(R[k]);
      });
    }
  })();
})();
