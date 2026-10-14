const A = { tab: 'overview', q: { courses: '', projects: '' }, st: { courses: 'all', projects: 'all' }, mf: 'all' };
const TABS = ['overview', 'pages', 'courses', 'projects', 'messages', 'settings'];
const $ = (s, r = document) => r.querySelector(s);
const uid = () => 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const field = (label, inner) => `<div class="field"><label>${label}${inner}</label></div>`;
function confirmDel(onYes) {
  const t = tr(), m = openModal(t.common.confirmDel, `<div class="row"><button class="btn danger" data-y>${t.common.delete}</button><button class="btn ghost" data-n>${t.common.cancel}</button></div>`);
  $('[data-y]', m.el).onclick = () => { m.close(); onYes(); }; $('[data-n]', m.el).onclick = m.close;
}
/* ---- courses / projects manager ---- */
function mgrHTML(kind) {
  const t = tr(), st = A.st[kind];
  return `<div class="panel"><div class="filters" style="padding:1rem;margin-bottom:0"><input id="mq" aria-label="${t.common.search}" placeholder="${t.common.search}" value="${esc(A.q[kind])}" style="flex:1 1 200px">
    <select id="ms" aria-label="${t.common.status}" style="width:auto"><option value="all">${t.common.all}</option><option value="published"${st === 'published' ? ' selected' : ''}>${t.common.published}</option><option value="draft"${st === 'draft' ? ' selected' : ''}>${t.common.draft}</option></select>
    <button class="btn primary sm" id="madd">+ ${t.common.add}</button></div><div id="mlist"></div></div>`;
}
function drawMgr(kind) {
  const t = tr(), a = t.admin, L = App.lang, items = App.data[kind], cats = kind === 'courses' ? t.courses.cats : t.projects.cats;
  const q = A.q[kind].toLowerCase(), st = A.st[kind];
  const shown = items.filter((i) => (st === 'all' || i.status === st) && (i.title.ar + i.title.en).toLowerCase().includes(q));
  $('#mlist').innerHTML = shown.length ? shown.map((i) => `<div class="trow"><div><b>${esc(i.title[L])}</b> ${i.sample ? `<span class="tag sample">${t.common.sample}</span>` : ''}<div class="muted" style="font-size:.85rem">${cats[i.category]} · ${i.status === 'published' ? t.common.published : t.common.draft}</div></div>
    <div class="row" style="gap:.4rem" data-id="${i.id}"><button class="btn ghost sm" data-act="toggle">${i.status === 'published' ? a.unpublish : a.publish}</button><button class="btn ghost sm" data-act="edit">${t.common.edit}</button><button class="btn danger sm" data-act="del">${t.common.delete}</button></div></div>`).join('') : `<p class="empty" style="border:0">${t.common.empty}</p>`;
}
function itemForm(kind, item) {
  const t = tr(), a = t.admin, L = App.lang, isC = kind === 'courses', cats = kind === 'courses' ? t.courses.cats : t.projects.cats;
  const v = item || { title: { ar: '', en: '' }, desc: { ar: '', en: '' }, category: Object.keys(cats)[0], status: 'draft', level: 'beginner', duration: { ar: '', en: '' }, tech: '' };
  const opts = (o, cur) => Object.entries(o).map(([k, l]) => `<option value="${k}"${cur === k ? ' selected' : ''}>${l}</option>`).join('');
  const m = openModal(item ? t.common.edit : t.common.add, `<form>
    ${field(a.titleAr, `<input name="ta" required value="${esc(v.title.ar)}">`)}${field(a.titleEn, `<input name="te" required value="${esc(v.title.en)}">`)}
    ${field(a.descAr, `<textarea name="da" rows="2">${esc(v.desc.ar)}</textarea>`)}${field(a.descEn, `<textarea name="de" rows="2">${esc(v.desc.en)}</textarea>`)}
    ${field(t.common.category, `<select name="category">${opts(cats, v.category)}</select>`)}
    ${isC ? `<div class="two">${field(a.levelF, `<select name="level">${opts(t.courses.levels, v.level)}</select>`)}${field(a.durationF, `<input name="dur" value="${esc(v.duration?.[L] || '')}">`)}</div>` : field(a.techF, `<input name="tech" value="${esc(v.tech || '')}">`)}
    ${field(t.common.status, `<select name="status"><option value="draft"${v.status === 'draft' ? ' selected' : ''}>${t.common.draft}</option><option value="published"${v.status === 'published' ? ' selected' : ''}>${t.common.published}</option></select>`)}
    <div class="row"><button class="btn primary">${t.common.save}</button><button type="button" class="btn ghost" data-n>${t.common.cancel}</button></div></form>`);
  $('[data-n]', m.el).onclick = m.close;
  $('form', m.el).onsubmit = (e) => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    const n = { ...item, id: item?.id || uid(), category: f.category, status: f.status, title: { ar: f.ta, en: f.te }, desc: { ar: f.da, en: f.de }, sample: item?.sample ?? false };
    if (isC) { n.level = f.level; n.duration = { ar: f.dur, en: f.dur }; n.outcomes = item?.outcomes || { ar: [], en: [] }; } else n.tech = f.tech;
    const list = App.data[kind]; App.data[kind] = item ? list.map((x) => (x.id === n.id ? n : x)) : [n, ...list];
    App.save(kind); m.close(); drawMgr(kind);
  };
}
function bindMgr(kind) {
  drawMgr(kind);
  $('#mq').oninput = (e) => { A.q[kind] = e.target.value; drawMgr(kind); };
  $('#ms').onchange = (e) => { A.st[kind] = e.target.value; drawMgr(kind); };
  $('#madd').onclick = () => itemForm(kind, null);
  $('#mlist').onclick = (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const id = b.parentElement.dataset.id, it = App.data[kind].find((x) => x.id === id);
    if (b.dataset.act === 'edit') itemForm(kind, it);
    if (b.dataset.act === 'toggle') { it.status = it.status === 'published' ? 'draft' : 'published'; App.save(kind); drawMgr(kind); }
    if (b.dataset.act === 'del') confirmDel(() => { App.data[kind] = App.data[kind].filter((x) => x.id !== id); App.save(kind); drawMgr(kind); });
  };
}
/* ---- messages ---- */
function drawMsgs() {
  const t = tr(), a = t.admin, list = App.data.messages.filter((m) => A.mf === 'all' || (A.mf === 'unread' ? !m.read : m.read));
  $('#mpills').innerHTML = [['all', t.common.all], ['unread', a.unread], ['read', a.read]].map(([k, l]) => `<button class="pill" data-f="${k}" aria-pressed="${A.mf === k}">${l}</button>`).join('');
  $('#mlist').innerHTML = list.length ? list.map((m) => `<div class="trow"><div><b style="font-weight:${m.read ? 400 : 700}">${esc(m.name)}</b> <span class="tag sample">${m.demo ? a.demoRec : a.localRec}</span><div class="muted" style="font-size:.85rem">${esc(m.email)} · ${t.contact.types[m.type]}</div></div>
    <div class="row" style="gap:.4rem" data-id="${m.id}"><button class="btn ghost sm" data-act="view">${t.common.details}</button><button class="btn danger sm" data-act="del">${t.common.delete}</button></div></div>`).join('') : `<p class="empty" style="border:0">${t.common.empty}</p>`;
}
function bindMsgs() {
  drawMsgs();
  $('#mpills').onclick = (e) => { const b = e.target.closest('[data-f]'); if (b) { A.mf = b.dataset.f; drawMsgs(); } };
  $('#mlist').onclick = (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return; const id = b.parentElement.dataset.id, m = App.data.messages.find((x) => x.id === id), t = tr(), a = t.admin;
    if (b.dataset.act === 'del') return confirmDel(() => { App.data.messages = App.data.messages.filter((x) => x.id !== id); App.save('messages'); drawMsgs(); });
    if (!m.read) { m.read = true; App.save('messages'); drawMsgs(); }
    const md = openModal(m.name, `<p class="muted">${esc(m.email)} · ${t.contact.types[m.type]}</p><p style="margin:1rem 0;white-space:pre-wrap">${esc(m.message)}</p><button class="btn ghost sm" data-flip>${a.markUnread}</button>`);
    const fl = $('[data-flip]', md.el); fl.onclick = () => { m.read = !m.read; App.save('messages'); fl.textContent = m.read ? a.markUnread : a.markRead; drawMsgs(); };
  };
}
/* ---- settings / pages ---- */
function settingsHTML() {
  const a = tr().admin, d = App.data.settings, i = (n, val, x = '') => `<input name="${n}" value="${esc(val)}" ${x}>`, ta = (n, val) => `<textarea name="${n}" rows="2">${esc(val)}</textarea>`;
  return `<form class="panel" id="sf" style="padding:1.5rem"><div class="two">${field(a.company, i('company', d.company))}${field(a.accent, i('accent', d.accent, 'type="color"'))}</div>
    <div class="two">${field(a.taglineF + ' (AR)', i('tagAr', d.tagline.ar))}${field(a.taglineF + ' (EN)', i('tagEn', d.tagline.en))}</div>
    <div class="two">${field(a.email, i('email', d.email, 'type="email"'))}${field(a.phone, i('phone', d.phone))}</div>${field(a.social, i('social', d.social, 'type="url" placeholder="https://"'))}
    <div class="two">${field(a.seoT + ' (AR)', i('stAr', d.seoTitle.ar))}${field(a.seoT + ' (EN)', i('stEn', d.seoTitle.en))}</div>
    <div class="two">${field(a.seoD + ' (AR)', ta('sdAr', d.seoDesc.ar))}${field(a.seoD + ' (EN)', ta('sdEn', d.seoDesc.en))}</div>
    <div class="row"><button class="btn primary">${tr().common.save}</button><button type="button" class="btn danger" id="reset">${a.reset}</button><span role="status" class="muted" id="sok"></span></div></form>`;
}
function bindSettings() {
  $('#sf').onsubmit = (e) => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)), s = App.data.settings;
    Object.assign(s, { company: f.company, accent: f.accent, email: f.email, phone: f.phone, social: f.social, tagline: { ar: f.tagAr, en: f.tagEn }, seoTitle: { ar: f.stAr, en: f.stEn }, seoDesc: { ar: f.sdAr, en: f.sdEn } });
    App.save('settings'); applyLang(); $('#sok').textContent = tr().admin.saved; setTimeout(() => { const o = $('#sok'); if (o) o.textContent = ''; }, 2000);
  };
  $('#reset').onclick = () => { App.data = { courses: structuredClone(seedCourses), projects: structuredClone(seedProjects), messages: structuredClone(seedMessages), settings: structuredClone(seedSettings) }; ['courses', 'projects', 'messages', 'settings'].forEach((k) => App.save(k)); adminRender(); };
}
function pagesHTML() {
  const t = tr(), a = t.admin, s = App.data.settings;
  return `<p class="notice">${a.pagesNote}</p><div class="panel" style="margin-bottom:1.5rem">${[['index.html', 'home'], ['about.html', 'about'], ['courses.html', 'courses'], ['projects.html', 'projects'], ['contact.html', 'contact']].map(([h, k]) => `<div class="trow"><b>${t.nav[k]}</b><a class="btn ghost sm" href="${h}" target="_blank" rel="noopener">${a.open}</a></div>`).join('')}</div>
    <div class="panel" style="padding:1.5rem"><h3 style="margin-bottom:1rem">${a.heroOverride}</h3>${field('AR', `<textarea id="hAr" rows="2" placeholder="${esc(t.hero.headline)}">${esc(s.heroHeadline.ar)}</textarea>`)}${field('EN', `<textarea id="hEn" rows="2">${esc(s.heroHeadline.en)}</textarea>`)}</div>`;
}
/* ---- shell ---- */
function adminRender() {
  const t = tr(), a = t.admin, d = App.data; applyLang();
  const drafts = [...d.courses, ...d.projects].filter((x) => x.status === 'draft').length, unread = d.messages.filter((m) => !m.read).length;
  const metrics = [[a.mCourses, d.courses.filter((c) => c.status === 'published').length], [a.mProjects, d.projects.length], [a.mMessages, d.messages.length], [a.mDrafts, drafts], [a.unread, unread]];
  let body = '';
  if (A.tab === 'overview') body = `<div class="metrics">${metrics.map(([l, n]) => `<div class="metric"><b>${n}</b><span class="muted">${l}</span></div>`).join('')}</div>`;
  if (A.tab === 'pages') body = pagesHTML();
  if (A.tab === 'courses' || A.tab === 'projects') body = mgrHTML(A.tab);
  if (A.tab === 'messages') body = `<div class="panel"><div class="filters" style="padding:1rem;margin-bottom:0"><div class="pills" id="mpills"></div></div><div id="mlist"></div></div>`;
  if (A.tab === 'settings') body = settingsHTML();
  $('#admin').innerHTML = `<div class="adm"><aside class="side" aria-label="${a.title}"><div class="brand" style="margin-bottom:1rem"><img class="logo" src="assets/logo.jpg" alt="" width="48" height="48"><span>${a.title}</span></div>
    ${TABS.map((k) => `<button data-tab="${k}"${A.tab === k ? ' aria-current="page"' : ''}>${a[k]}</button>`).join('')}</aside>
    <div class="amain"><p class="notice" role="note">${a.preview}</p><div class="atop"><div><p class="crumb">${a.title} / ${a[A.tab]}</p><h1 style="font-size:1.7rem">${a[A.tab]}</h1></div>
      <div class="row" style="align-items:center"><a href="index.html" class="btn ghost sm">${a.backToSite}</a><button class="btn ghost sm" id="alang" aria-label="${t.switchLang}">${t.langName}</button><span class="muted">${a.user}</span></div></div>${body}</div></div>`;
  document.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => { A.tab = b.dataset.tab; adminRender(); }));
  $('#alang').onclick = () => { App.lang = App.lang === 'ar' ? 'en' : 'ar'; adminRender(); };
  if (A.tab === 'courses' || A.tab === 'projects') bindMgr(A.tab);
  if (A.tab === 'messages') bindMsgs();
  if (A.tab === 'settings') bindSettings();
  if (A.tab === 'pages') ['Ar', 'En'].forEach((l) => ($('#h' + l).oninput = (e) => { App.data.settings.heroHeadline[l.toLowerCase()] = e.target.value; App.save('settings'); }));
}
document.addEventListener('DOMContentLoaded', adminRender);
