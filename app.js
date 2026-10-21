(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const VERSION = '12';
  const C = window.CONTENT;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- datos guardados en este dispositivo ---------- */
  const KEY = 'mf.v1';
  let S = {};
  try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const dkey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  S.days = S.days || {};
  S.pos = S.pos || {};
  S.ans = S.ans || {};
  S.chk = S.chk || {};
  S.sleep = S.sleep || { nights: {}, shortcut: 'Dormir' };
  S.hist = S.hist || [];
  S.aff = S.aff || '';
  S.cyc = S.cyc || { n: 1, start: dkey(new Date()), cur: 1, done: {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  const todayKey = () => dkey(new Date());
  const today = () => {
    const k = todayKey();
    return S.days[k] || (S.days[k] = { t: [false, false, false], closed: false, med: 0 });
  };
  const streak = () => {
    const d = new Date();
    if (!(S.days[dkey(d)] && S.days[dkey(d)].closed)) d.setDate(d.getDate() - 1);
    let n = 0;
    while (S.days[dkey(d)] && S.days[dkey(d)].closed) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  const A = k => S.ans[k] || '';
  const setA = (k, v) => { if (v && v.trim()) S.ans[k] = v; else delete S.ans[k]; save(); };
  const cKey = (n, d, id) => `c${n}.d${d}.${id}`;
  const fmtDate = s => new Date(s + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const sleepCount = () => Object.keys(S.sleep.nights).filter(k => S.sleep.nights[k]).length;
  // El día recién completado se mantiene en la tarjeta hasta medianoche; el siguiente llega al día siguiente.
  const shownDay = () => { const c = S.cyc, p = c.cur - 1; return p >= 1 && c.done[p] && ((c.doneOn && c.doneOn[p]) ? c.doneOn[p] === todayKey() : p === 1 && c.start === todayKey()) ? p : c.cur; };
  const cycleComplete = () => [1, 2, 3, 4, 5, 6, 7].every(d => S.cyc.done[d]);

  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------- fondos de vídeo y navegación ---------- */
  const app = $('#app');
  function showBg(name) {
    $$('.bg').forEach(v => {
      const on = v.id === 'v-' + name;
      v.classList.toggle('on', on);
      if (on) {
        if (!v.src) v.src = v.dataset.src;
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      } else v.pause();
    });
  }
  function go(name) {
    closeSheet();
    $$('nav button').forEach(b => b.classList.toggle('on', b.dataset.s === name));
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === name));
    showBg(name);
    if (name === 'tapping') {
      const f = $('#tap-frame');
      if (!f.getAttribute('src')) f.setAttribute('src', 'tapping/tapping.html');
    }
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    renderAll();
    updateMini();
  }
  $$('nav button').forEach(b => b.onclick = () => go(b.dataset.s));

  /* ---------- deslizar para confirmar ---------- */
  function bindSlide(slide, onDone) {
    const th = $('.thumb', slide), lab = $('.lab', slide);
    let drag = false, x0 = 0, max = 0;
    th.addEventListener('pointerdown', e => {
      drag = true; x0 = e.clientX; max = slide.clientWidth - 58;
      th.classList.add('drag');
      try { th.setPointerCapture(e.pointerId); } catch (err) {}
    });
    th.addEventListener('pointermove', e => {
      if (!drag) return;
      const x = Math.max(0, Math.min(max, e.clientX - x0));
      th.style.transform = `translateX(${x}px)`;
      lab.style.opacity = 1 - x / max;
    });
    const end = e => {
      if (!drag) return; drag = false;
      th.classList.remove('drag');
      const x = Math.max(0, Math.min(max, e.clientX - x0));
      th.style.transform = ''; lab.style.opacity = 1;
      if (max && x / max > 0.85) onDone();
    };
    th.addEventListener('pointerup', end);
    th.addEventListener('pointercancel', end);
  }

  /* ---------- HOY ---------- */
  function greeting() {
    const h = new Date().getHours();
    const g = h < 6 ? 'Buenas noches' : h < 13 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
    const f = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    return `${g} · ${f}`;
  }
  const etapaDe = d => C.ETAPAS.find(e => e.days.includes(d));

  function renderCyc() {
    const c = S.cyc, el = $('#cyc-card');
    const doneN = Object.keys(c.done).filter(k => c.done[k]).length;
    $('#ciclo-meta').textContent = `${doneN} de 7 días`;
    const dots = '<div class="dots">' + [1, 2, 3, 4, 5, 6, 7].map(d => `<i class="${c.done[d] ? 'd' : d === c.cur ? 'c' : ''}"></i>`).join('') + '</div>';
    if (cycleComplete()) {
      el.innerHTML = `<div class="cyc glass"><div class="k">Ciclo ${c.n} · completo</div><h2>Lo has hecho ✦</h2><p>Sigue con tu rutina de cada día. Cuando tengas un objetivo nuevo, empieza otro ciclo.</p>${dots}<button class="btn" data-new>Empezar un nuevo ciclo</button></div>`;
      $('[data-new]', el).onclick = startNew;
      return;
    }
    const sd = shownDay(), day = C.CYCLE[sd - 1], fin = !!c.done[sd];
    el.innerHTML = `<div class="cyc glass"><div class="k">Ciclo ${c.n} · Día ${sd} de 7 · ${etapaDe(sd).name}</div><h2>${esc(day.title)}</h2><p>${esc(day.why)}</p>${dots}<button class="btn">${fin ? 'Día completado ✦ · Ver lo que hice' : `Ver qué toca hoy · ${esc(day.time)}`}</button></div>`;
    $('.cyc', el).onclick = () => openDay(sd);
  }

  function renderHoy() {
    const t = today();
    $('#fecha').textContent = greeting();
    $$('[data-tick]').forEach(b => {
      const on = t.t[+b.dataset.tick];
      b.classList.toggle('on', on);
      b.closest('.card').classList.toggle('sel', on);
    });
    $('#cuenta').textContent = `${t.t.filter(Boolean).length} de 3`;
    const n = streak();
    $('#racha').textContent = n > 0 ? `Racha · ${n} ${n === 1 ? 'día' : 'días'}` : 'Empieza hoy';
    $('#slide').classList.toggle('done', t.closed);
    $('#slab').textContent = t.closed ? 'Día cerrado. Gracias ✦' : 'Desliza para cerrar el día';
    $('#sleep-badge').textContent = `${sleepCount()} / 21`;
    renderCyc();
  }

  $$('[data-tick]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    const t = today(), i = +b.dataset.tick;
    t.t[i] = !t.t[i]; save(); renderHoy();
  });
  $$('.card[data-r]').forEach(c => c.onclick = () => openRoutine(c.dataset.r));
  $('#hoy-play').onclick = e => { e.stopPropagation(); playTrack('exito', true); };
  bindSlide($('#slide'), () => { today().closed = true; save(); renderHoy(); });
  $('#slide').addEventListener('click', () => {
    if ($('#slide').classList.contains('done')) { today().closed = false; save(); renderHoy(); }
  });

  function startNew() {
    if (!confirm('¿Empezar un nuevo ciclo? Todo lo que has escrito en este ciclo se queda guardado en "Escribir".')) return;
    S.hist.push({ n: S.cyc.n, start: S.cyc.start, end: todayKey() });
    S.cyc = { n: S.cyc.n + 1, start: todayKey(), cur: 1, done: {} };
    save(); renderAll();
    toast('Nuevo ciclo empezado. Empieza por el Día 1.');
  }

  /* ---------- CAMINO ---------- */
  function renderCamino() {
    const c = S.cyc;
    $('#stage-pill').textContent = cycleComplete() ? 'Completo' : `Día ${shownDay()} de 7`;
    $('#camino-eyebrow').textContent = `Ciclo ${c.n} · desde el ${fmtDate(c.start)}`;
    let h = '';
    C.ETAPAS.forEach(e => {
      h += `<div class="etapa"><h3><b>${e.n}</b>${e.name}</h3><p>${e.txt}</p>`;
      e.days.forEach(d => {
        const day = C.CYCLE[d - 1];
        const done = c.done[d], now = d === c.cur && !done;
        h += `<div class="day glass ${done ? 'done' : ''} ${now ? 'now' : ''}" data-d="${d}"><div class="dm">${done ? '✓' : d}</div><div class="grow"><h4>Día ${d} · ${esc(day.title)}</h4><p>${esc(day.time)}${now ? ' · hoy toca' : ''}</p></div></div>`;
      });
      h += '</div>';
    });
    if (cycleComplete()) h += '<button class="btn" data-new>Empezar un nuevo ciclo</button>';
    if (S.adn) {
      const next = new Date(S.adn + 'T12:00:00'); next.setDate(next.getDate() + 21);
      h += `<p class="note">Última activación de ADN: ${fmtDate(S.adn)}. Puedes repetirla a partir del ${fmtDate(dkey(next))}.</p>`;
    }
    $('#camino-list').innerHTML = h;
    $$('#camino-list .day').forEach(el => el.onclick = () => openDay(+el.dataset.d));
    const nb = $('#camino-list [data-new]'); if (nb) nb.onclick = startNew;
  }

  /* ---------- ESCRIBIR ---------- */
  const VISION = [
    ['Mi objetivo 1', 3, 'c2'], ['Mi objetivo 2', 3, 'e2'],
    ['Mi versión exitosa', 5, 'b'], ['Mis 3 emociones', 5, 'c'],
    ['Mi acción de 24 horas', 6, 'b'], ['Mi palabra y frase del año', 7, 'c'],
  ];
  const countAns = (n, d) => C.CYCLE[d - 1].steps.filter(s => s.t === 'write' && A(cKey(n, d, s.id))).length;
  function renderEscribir() {
    const n0 = S.cyc.n;
    $('#esc-pill').textContent = `Ciclo ${n0}`;
    let vis = VISION.map(([lab, d, id]) => {
      // el valor más reciente de cualquier ciclo
      for (let n = n0; n >= 1; n--) { const v = A(cKey(n, d, id)); if (v) return `<div class="it"><small>${lab}</small><span>${esc(v)}</span></div>`; }
      return '';
    }).join('');
    if (!vis) vis = '<em>Aún no has escrito tu visión. Aparecerá aquí con los días 3, 5, 6 y 7 de tu ciclo.</em>';
    let h = `<div class="vis glass">${vis}</div>`;
    for (let n = n0; n >= 1; n--) {
      let rows = '';
      for (let d = 1; d <= 7; d++) {
        const k = countAns(n, d);
        if (k) rows += `<div class="day glass" data-d="${d}" data-n="${n}"><div class="dm">${d}</div><div class="grow"><h4>${esc(C.CYCLE[d - 1].title)}</h4><p>${k} ${k === 1 ? 'respuesta' : 'respuestas'}</p></div></div>`;
      }
      if (rows) h += `<div class="sec"><b>Ciclo ${n}</b><span>${n === n0 ? 'en curso' : 'anterior'}</span></div>${rows}`;
    }
    $('#esc-list').innerHTML = h;
    $$('#esc-list .day').forEach(el => el.onclick = () => openDay(+el.dataset.d, +el.dataset.n));
  }

  /* ---------- pantalla de un día / de la rutina ---------- */
  const sheet = $('#sheet'), sin = $('#sheet-in');
  let cfg = null;

  function openDay(d, n = S.cyc.n) {
    const day = C.CYCLE[d - 1];
    cfg = {
      kind: 'day', d, n, title: day.title, time: day.time, why: day.why, steps: day.steps,
      meta: `Ciclo ${n} · Día ${d} de 7 · ${etapaDe(d).name}`,
      key: id => cKey(n, d, id), ck: i => `c${n}.d${d}.#${i}`,
    };
    renderSheet();
  }
  function openRoutine(id) {
    const r = C.ROUTINES[id], date = todayKey();
    cfg = {
      kind: 'routine', id, title: r.title, time: r.time, why: r.why, steps: r.steps,
      meta: 'Tu rutina de hoy',
      key: sid => `r.${date}.${sid}`, ck: i => `r.${date}.${id}.#${i}`,
    };
    renderSheet();
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true; sin.innerHTML = ''; cfg = null;
    renderAll();
  }

  const adnRecent = () => {
    if (!S.adn) return null;
    const next = new Date(S.adn + 'T12:00:00'); next.setDate(next.getDate() + 21);
    return next > new Date() ? next : null;
  };

  function isDone(st, i) {
    if (st.t === 'write') return !!A(cfg.key(st.id));
    if (st.t === 'aff') return !!S.aff.trim();
    if (st.t === 'sleep') return !!S.sleep.nights[todayKey()];
    if (st.adn && adnRecent() && !S.chk[cfg.ck(i)]) return true;
    return !!S.chk[cfg.ck(i)];
  }
  function updateProg() {
    if (!cfg) return;
    const req = cfg.steps.map((s, i) => [s, i]).filter(([s]) => !s.opt);
    const done = req.filter(([s, i]) => isDone(s, i)).length;
    $('#sh-pt').textContent = `${done} de ${req.length} pasos`;
    $('#sh-dots').innerHTML = req.map(([s, i]) => `<i class="${isDone(s, i) ? 'd' : ''}"></i>`).join('');
    $$('.step', sin).forEach(el => el.classList.toggle('ok', isDone(cfg.steps[+el.dataset.i], +el.dataset.i)));
  }
  const tickBtn = (on) => `<button class="tick ${on ? 'on' : ''}" aria-label="Marcar como hecho"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></button>`;
  const grow = t => { t.style.height = 'auto'; t.style.height = Math.max(96, t.scrollHeight) + 'px'; };

  function stepEl(st, i) {
    const el = document.createElement('div');
    el.className = 'step glass'; el.dataset.i = i;
    const toggle = btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const k = cfg.ck(i); S.chk[k] = !S.chk[k];
        if (st.adn) S.adn = S.chk[k] ? todayKey() : null;
        save(); btn.classList.toggle('on', !!S.chk[k]); updateProg();
      };
    };
    const area = (val, onInput, ph) => {
      const t = document.createElement('textarea');
      t.value = val; t.placeholder = ph || 'Escribe aquí…'; t.rows = 3;
      t.addEventListener('input', () => { onInput(t.value); grow(t); updateProg(); });
      requestAnimationFrame(() => grow(t));
      return t;
    };

    if (st.t === 'write') {
      el.innerHTML = `<span class="n">${esc(cfg.kind === 'day' ? 'ESCRIBIR' : 'ESCRIBIR')}</span><div class="q">${esc(st.q)}</div>${st.hint ? `<div class="h">${esc(st.hint)}</div>` : ''}`;
      el.append(area(A(cfg.key(st.id)), v => setA(cfg.key(st.id), v)));
    } else if (st.t === 'aff') {
      el.innerHTML = '<span class="n">MIS AFIRMACIONES</span><div class="q">Escribe 3 a 5 frases en primera persona, en presente y en positivo.</div><div class="h">Sin «no». Ejemplo: «Soy merecedora de todo lo que deseo». Léelas en voz alta por la mañana y cuando dudes. Se guardan para todos tus días.</div>';
      el.append(area(S.aff, v => { S.aff = v; save(); }, 'Soy…\nTengo…\nMerezco…'));
    } else if (st.t === 'do') {
      el.innerHTML = `<div class="srow">${tickBtn(S.chk[cfg.ck(i)])}<div class="grow"><p>${esc(st.text)}</p>${st.more ? '<ul class="more">' + st.more.map(m => `<li>${esc(m)}</li>`).join('') + '</ul>' : ''}</div></div>`;
      toggle($('.tick', el));
    } else if (st.t === 'audio') {
      const tr = TRACKS.find(x => x.id === st.id);
      let extra = '';
      if (st.adn && adnRecent()) extra = `<div class="st">Ya la hiciste el ${fmtDate(S.adn)}. Mejor espera hasta el ${fmtDate(dkey(adnRecent()))}: tu sistema necesita ese espacio.</div>`;
      el.innerHTML = `<div class="arow" data-a="${st.id}"><div class="play"></div><div class="grow"><h4>${esc(tr.title)}</h4><p>${esc(st.text)}</p>${extra}<div class="st" data-st></div></div>${tickBtn(S.chk[cfg.ck(i)])}</div>`;
      toggle($('.tick', el));
      $('.arow', el).onclick = () => playTrack(st.id, false);
    } else if (st.t === 'sleep') {
      const drawSleep = () => {
        const n = sleepCount(), tk = todayKey(), on = !!S.sleep.nights[tk];
        const keys = Object.keys(S.sleep.nights).filter(k => S.sleep.nights[k]).sort();
        const dots = Array.from({ length: 21 }, (_, j) => `<i class="${j < n ? 'd' : ''}"></i>`).join('');
        const msg = n >= 21 ? `Completaste ${n} noches ✦ Puedes seguir todo el tiempo que quieras.` : `Llevas ${n} de 21 noches. ${on ? 'Esta noche ya está marcada.' : 'Cuando te vayas a dormir, ponlo y márcala.'}`;
        el.innerHTML = `<span class="n">REPROGRAMACIÓN MENTAL</span>
          <div class="q">${esc(msg)}</div>
          <div class="dots d21" style="margin:14px 0 4px">${dots}</div>
          <button class="btn" id="sleep-open">${cur === 'dormir' && !audio.paused ? 'Pausar mi audio para dormir' : 'Escuchar mi audio para dormir'}</button>
          <button class="btn ghost" id="sleep-restart">Empezar de nuevo desde el principio</button>
          <button class="btn ghost" id="sleep-mark">${on ? 'Desmarcar esta noche' : 'Marcar esta noche'}</button>`;
        $('#sleep-open', el).onclick = async () => {
          await playTrack('dormir', false);
          drawSleep();
        };
        $('#sleep-restart', el).onclick = async () => {
          await restartTrack('dormir');
          drawSleep();
        };
        $('#sleep-mark', el).onclick = () => { if (on) delete S.sleep.nights[tk]; else S.sleep.nights[tk] = true; save(); drawSleep(); updateProg(); };
      };
      drawSleep();
    } else if (st.t === 'tap') {
      el.innerHTML = `<div class="srow">${tickBtn(S.chk[cfg.ck(i)])}<div class="grow"><p><b style="font-weight:500">Haz tu tapping de la noche.</b> Suelta lo que no es tuyo y ábrete a recibir.</p>
        <button class="btn" data-go-tap>Abrir mi Centro Tapping</button>
        <ul class="more"><li>Para esta noche te van bien «Dormir» o «Liberación de la tensión nerviosa y el estrés».</li></ul></div></div>`;
      toggle($('.tick', el));
      $('[data-go-tap]', el).onclick = () => go('tapping');
    }
    return el;
  }

  function renderSheet(keepScroll) {
    const y = sin.scrollTop;
    sin.innerHTML = '';
    const head = document.createElement('div');
    head.innerHTML = `<div class="sh-top"><button class="back" aria-label="Volver"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><div class="sh-meta">${esc(cfg.time)}</div></div>
      <div class="eyebrow">${esc(cfg.meta)}</div><h1>${esc(cfg.title)}</h1><p class="sh-why">${esc(cfg.why)}</p>
      <div class="sh-prog"><div class="dots" id="sh-dots"></div><span id="sh-pt"></span></div>`;
    sin.append(head);
    $('.back', head).onclick = closeSheet;
    cfg.steps.forEach((st, i) => sin.append(stepEl(st, i)));

    const end = document.createElement('div'); end.className = 'sh-end';
    if (cfg.kind === 'day') {
      if (cfg.n !== S.cyc.n) end.innerHTML = '';
      else if (S.cyc.done[cfg.d]) end.innerHTML = '<div class="slide glass done"><div class="lab">Día completado ✦</div><div class="thumb"></div></div>';
      else {
        end.innerHTML = '<div class="slide glass"><div class="lab">Desliza para terminar el día</div><div class="thumb"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div><div class="chev"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></div></div>';
        bindSlide($('.slide', end), () => {
          const d = cfg.d, c = S.cyc;
          c.done[d] = true; (c.doneOn = c.doneOn || {})[d] = todayKey(); if (d === c.cur) c.cur = Math.min(7, d + 1);
          save();
          const all = cycleComplete();
          closeSheet();
          toast(all ? 'Ciclo completo ✦ Gracias por llegar hasta aquí.' : `Día ${d} completado ✦`);
        });
      }
    } else {
      const idx = { manana: 0, dia: 1, noche: 2 }[cfg.id];
      if (idx !== undefined) {
        end.innerHTML = '<button class="btn">Hecho por hoy</button>';
        $('.btn', end).onclick = () => { today().t[idx] = true; save(); closeSheet(); };
      }
    }
    sin.append(end);
    sheet.hidden = false;
    updateProg(); refreshAudioRows();
    sin.scrollTop = keepScroll ? y : 0;
  }

  function refreshAudioRows() {
    if (!cfg) return;
    $$('.arow', sin).forEach(r => {
      const id = r.dataset.a, playing = cur === id && !audio.paused;
      $('.play', r).innerHTML = playing
        ? '<svg viewBox="0 0 12 12"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>'
        : '<svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z"/></svg>';
      const st = $('[data-st]', r);
      st.textContent = !have.has(id) ? 'Sin cargar. Toca para ir a cargarlo.' : cur === id ? `${playing ? 'Sonando' : 'En pausa'} · ${mmss(audio.currentTime)} / ${mmss(audio.duration)}` : '';
    });
  }

  function renderAll() { renderHoy(); renderCamino(); renderEscribir(); }

  /* ---------- AUDIOS: guardados en el dispositivo (IndexedDB) ---------- */
  const TRACKS = [
    { id: 'exito', title: 'Éxito Cuántico', tag: 'Cada mañana', match: ['exito cuantico'] },
    { id: 'diaria', title: 'Hipnosis diaria', tag: 'Cada día', match: ['hipnosis diaria'] },
    { id: 'memorias', title: 'Memorias futuras', tag: 'Día 5', match: ['memorias futuras'] },
    { id: 'dones', title: 'Dones y cualidades', tag: 'Día 1', match: ['dones y cualidades'] },
    { id: 'perdon', title: 'Meditación del perdón', tag: 'Día 2', match: ['del perdon'] },
    { id: 'regresiva', title: 'Sanación regresiva', tag: 'Día 4', match: ['sanacion regresiva'] },
    { id: 'adn', title: 'Activación de ADN', tag: 'Día 7 · cada 3 semanas', match: ['activacion adn'] },
    { id: 'dormir', title: 'Mi audio para dormir', tag: 'Cada noche · 21 noches', match: ['audio para dormir'], url: 'audio/dormir.mp3' },
  ];
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const have = new Set(TRACKS.filter(t => t.url).map(t => t.id));  // los alojados en la web siempre están

  const dbp = new Promise((res, rej) => {
    if (!window.indexedDB) return rej();
    const r = indexedDB.open('mf-audio', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('audio', { keyPath: 'id' });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  dbp.catch(() => {});
  const tx = (mode, fn) => dbp.then(db => new Promise((res, rej) => {
    const t = db.transaction('audio', mode), st = t.objectStore('audio');
    const q = fn(st);
    t.oncomplete = () => res(q && q.result);
    t.onerror = () => rej(t.error);
  }));
  const dbPut = rec => tx('readwrite', st => st.put(rec));
  const dbGet = id => tx('readonly', st => st.get(id));
  const dbKeys = () => tx('readonly', st => st.getAllKeys());

  async function refreshHave() {
    have.clear(); TRACKS.forEach(t => t.url && have.add(t.id));
    try { (await dbKeys() || []).forEach(k => have.add(k)); } catch (e) {}
    renderLib(); refreshAudioRows();
  }

  const audio = new Audio();
  audio.preload = 'metadata';
  let cur = null, curURL = null;
  const mmss = s => !isFinite(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  function renderLib() {
    $('#lib-count').textContent = `${have.size} de ${TRACKS.length} cargados`;
    $('#lib').innerHTML = TRACKS.map(t => {
      const on = have.has(t.id);
      const playing = cur === t.id && !audio.paused;
      const ico = playing
        ? '<svg viewBox="0 0 12 12"><rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/></svg>'
        : '<svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z"/></svg>';
      return `<div class="row glass ${on ? '' : 'off'} ${cur === t.id ? 'cur' : ''}" data-id="${t.id}"><div class="play">${ico}</div><div class="grow"><h4>${t.title}</h4><p>${on ? t.tag : 'Sin cargar'}</p></div></div>`;
    }).join('');
    $$('#lib .row').forEach(r => r.onclick = () => playTrack(r.dataset.id, false));
  }

  async function playTrack(id, jump) {
    if (!have.has(id)) { go('meditar'); $('#add-note').textContent = 'Este audio aún no está cargado. Pulsa "Añadir mis audios".'; return; }
    if (cur === id) { audio.paused ? audio.play() : audio.pause(); if (jump) go('meditar'); return; }
    const t0 = TRACKS.find(x => x.id === id);
    if (curURL) { URL.revokeObjectURL(curURL); curURL = null; }
    if (t0.url) audio.src = t0.url;
    else {
      const rec = await dbGet(id);
      if (!rec) { have.delete(id); renderLib(); return; }
      curURL = URL.createObjectURL(rec.blob);
      audio.src = curURL;
    }
    cur = id;
    const resume = S.pos[id];
    audio.onloadedmetadata = () => {
      if (resume && resume < audio.duration - 10) audio.currentTime = resume;
      progress();
    };
    const t = TRACKS.find(x => x.id === id);
    $('#now-t').textContent = t.title;
    setMedia(t);
    try { await audio.play(); } catch (e) {}
    if (jump) go('meditar');
    renderLib(); updateMini(); refreshAudioRows();
  }

  async function restartTrack(id) {
    delete S.pos[id]; save();
    if (cur === id) { audio.currentTime = 0; try { await audio.play(); } catch (e) {} progress(); }
    else await playTrack(id, false);
  }

  function setMedia(t) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: 'Manifestación' });
    navigator.mediaSession.setActionHandler('play', () => audio.play());
    navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    try { navigator.mediaSession.setActionHandler('seekto', d => { audio.currentTime = d.seekTime; }); } catch (e) {}
  }

  function progress() {
    const d = audio.duration || 0, c = audio.currentTime || 0, p = d ? (c / d) * 100 : 0;
    $('#prog-i').style.width = p + '%';
    $('#mp-i2').style.width = p + '%';
    $('#t-cur').textContent = mmss(c);
    $('#t-dur').textContent = mmss(d);
  }

  let lastSave = 0, lastRow = 0;
  audio.addEventListener('timeupdate', () => {
    progress();
    const now = Date.now();
    if (cur && now - lastSave > 5000) { lastSave = now; S.pos[cur] = audio.currentTime; save(); }
    if (now - lastRow > 1000) { lastRow = now; refreshAudioRows(); }
  });
  audio.addEventListener('play', () => { ui(); renderLib(); refreshAudioRows(); });
  audio.addEventListener('pause', () => { ui(); renderLib(); refreshAudioRows(); });
  audio.addEventListener('ended', () => {
    if (cur) delete S.pos[cur];
    today().med++; save(); ui(); renderLib(); refreshAudioRows();
  });

  function ui() {
    const playing = !audio.paused;
    $('#orb-wave').style.display = playing ? 'none' : '';
    $('#orb-pause').style.display = playing ? '' : 'none';
    $('#orbt').textContent = playing ? 'Respira… toca para pausar' : 'Toca para empezar';
    $('#med-hoy').textContent = `Hoy: ${today().med}`;
    $('#mp-i').innerHTML = playing
      ? '<rect x="2" y="1" width="3" height="10" rx="1"/><rect x="7" y="1" width="3" height="10" rx="1"/>'
      : '<path d="M2 1l9 5-9 5z"/>';
    updateMini();
  }
  function updateMini() {
    const onMed = $('#meditar').classList.contains('on');
    const show = !!cur && !audio.paused && !onMed;
    $('#mp').hidden = !show;
    app.classList.toggle('has-mini', show);
    if (cur) $('#mp-t').textContent = TRACKS.find(t => t.id === cur).title;
  }

  $('#orb').onclick = () => {
    if (cur) { audio.paused ? audio.play() : audio.pause(); return; }
    const first = TRACKS.find(t => have.has(t.id));
    if (!first) { $('#file').click(); return; }
    playTrack(have.has('exito') ? 'exito' : first.id, false);
  };
  $('#restart').onclick = () => { if (cur) restartTrack(cur); };
  $('#mp-btn').onclick = () => { audio.paused ? audio.play() : audio.pause(); };
  $('#prog-i').parentElement.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  // cargar los MP3 desde la carpeta del móvil
  $('#add').onclick = () => $('#file').click();
  $('#file').onchange = async e => {
    const files = [...e.target.files];
    let ok = 0, skip = 0, err1 = '';
    for (const f of files) {
      const n = norm(f.name);
      const t = TRACKS.find(x => x.match.some(m => n.includes(m)));
      if (!t) { skip++; continue; }
      try { await dbPut({ id: t.id, name: f.name, blob: f }); ok++; } catch (err) { skip++; err1 = err1 || String((err && err.message) || err || 'error'); }
    }
    e.target.value = '';
    let msg;
    if (!files.length) msg = 'No se eligió ningún archivo.';
    else if (err1) msg = `No se pudieron guardar los audios en este dispositivo (${err1}). Abre la app desde el icono de la pantalla de inicio, no desde Safari, y prueba otra vez.`;
    else if (!ok) msg = `Ningún nombre coincide (${files.length} archivos). Los nombres deben incluir, por ejemplo, «Éxito Cuántico», «Hipnosis Diaria», «Memorias Futuras», «Dones y Cualidades», «Meditación del Perdón», «Sanación Regresiva», «Activación ADN» o «Audio para dormir».`;
    else msg = `Cargados ${ok}` + (skip ? ` · ${skip} no reconocidos` : '') + '. Ya puedes reproducirlos sin conexión.';
    $('#add-note').textContent = msg;
    if (ok && navigator.storage && navigator.storage.persist) navigator.storage.persist();
    refreshHave();
  };

  /* ---------- arranque ---------- */
  renderAll(); renderLib(); ui();
  refreshHave();
  const start = ['hoy', 'camino', 'meditar', 'escribir', 'tapping'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'hoy';
  go(start);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (!cfg) renderAll();
    ui(); showBg($('.screen.on').id);
  });

  // actualizaciones: cuando llega una versión nueva se recarga sola, y se busca al volver a la app
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    const had = !!navigator.serviceWorker.controller;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (had && !reloading) { reloading = true; location.reload(); }
    });
    navigator.serviceWorker.register('sw.js').then(reg => {
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
    }).catch(() => {});
  }
  $('#ver').textContent = 'Versión ' + VERSION;
})();
