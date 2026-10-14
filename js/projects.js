let PCAT = 'all';
function drawProjects() {
  const t = tr(), list = App.data.projects.filter((p) => p.status === 'published' && (PCAT === 'all' || p.category === PCAT));
  document.getElementById('project-grid').innerHTML = list.length ? `<div class="grid">${list.map(projectCard).join('')}</div>` : `<p class="empty">${t.common.empty}</p>`;
  document.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === PCAT)));
}
App.init('projects', () => {
  const t = tr();
  document.getElementById('app').innerHTML = `
  <section class="pagehead"><div class="wrap"><p class="eyebrow">${t.nav.projects}</p><h1 class="gold">${t.projects.title}</h1><p class="lead">${t.projects.intro}</p></div></section>
  <section style="padding-top:1rem"><div class="wrap"><div class="pills" role="group" aria-label="${t.common.category}" style="margin-bottom:2rem">${['all', ...Object.keys(t.projects.cats)].map((k) => `<button class="pill" data-cat="${k}">${k === 'all' ? t.common.all : t.projects.cats[k]}</button>`).join('')}</div><div id="project-grid"></div></div></section>`;
  document.querySelectorAll('[data-cat]').forEach((b) => (b.onclick = () => { PCAT = b.dataset.cat; drawProjects(); }));
  drawProjects();
});
