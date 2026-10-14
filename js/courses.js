const CF = { q: '', cat: 'all', lvl: 'all' };
function drawCourses() {
  const t = tr(), L = App.lang, q = CF.q.trim().toLowerCase();
  const list = App.data.courses.filter((c) => c.status === 'published' && (CF.cat === 'all' || c.category === CF.cat) && (CF.lvl === 'all' || c.level === CF.lvl) && (c.title[L] + ' ' + c.desc[L]).toLowerCase().includes(q));
  document.getElementById('course-grid').innerHTML = list.length ? `<div class="grid">${list.map(courseCard).join('')}</div>` : `<p class="empty">${t.common.empty}</p>`;
  document.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === CF.cat)));
}
App.init('courses', () => {
  const t = tr();
  document.getElementById('app').innerHTML = `
  <section class="pagehead"><div class="wrap"><p class="eyebrow">${t.nav.courses}</p><h1 class="gold">${t.courses.title}</h1><p class="lead">${t.courses.intro}</p></div></section>
  <section style="padding-top:1rem"><div class="wrap">
    <div class="filters"><div style="position:relative;flex:1 1 240px"><label class="sr" for="cq">${t.common.search}</label><span style="position:absolute;inset-inline-start:12px;top:15px;color:var(--muted)">${icon("search",16)}</span><input id="cq" style="padding-inline-start:36px" type="search" placeholder="${t.common.search}" value="${esc(CF.q)}"></div>
      <div style="flex:0 1 180px"><label class="sr" for="cl">${t.courses.level}</label><select id="cl"><option value="all">${t.courses.level}: ${t.common.all}</option>${Object.entries(t.courses.levels).map(([k, v]) => `<option value="${k}"${CF.lvl === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div></div>
    <div class="pills" role="group" aria-label="${t.common.category}" style="margin-bottom:2rem">${['all', ...Object.keys(t.courses.cats)].map((k) => `<button class="pill" data-cat="${k}">${k === 'all' ? t.common.all : t.courses.cats[k]}</button>`).join('')}</div>
    <div id="course-grid"></div></div></section>`;
  document.getElementById('cq').oninput = (e) => { CF.q = e.target.value; drawCourses(); };
  document.getElementById('cl').onchange = (e) => { CF.lvl = e.target.value; drawCourses(); };
  document.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => { CF.cat = b.dataset.cat; drawCourses(); }));
  drawCourses();
});
