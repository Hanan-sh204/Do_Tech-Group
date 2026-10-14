App.init('about', () => {
  const t = tr(), a = t.about;
  document.getElementById('app').innerHTML = `
  <section class="pagehead"><div class="wrap"><p class="eyebrow">${a.title}</p><h1 class="gold">${t.brand}</h1><p class="lead">${a.p[0]}</p></div></section>
  <section class="alt"><div class="wrap split">${rv(`<h2>${t.services.title}</h2>`)}<div style="display:grid;gap:1.2rem">${a.p.slice(1).map((p, i) => rv(`<p class="lead">${p}</p>`, i * 0.08)).join('')}</div></div></section>
  <section><div class="wrap grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))">
    ${rv(`<div class="card"><div class="body"><span style="color:var(--gold)">${icon('target', 24)}</span><h2 style="font-size:1.4rem">${a.missionT}</h2><p>${a.mission}</p></div></div>`)}
    ${rv(`<div class="card"><div class="body"><span style="color:var(--gold)">${icon('eye', 24)}</span><h2 style="font-size:1.4rem">${a.visionT}</h2><p>${a.vision}</p></div></div>`, 0.1)}</div></section>
  <section class="alt"><div class="wrap split">${rv(`<h2>${a.valuesT}</h2>`)}<ul class="numlist">${a.values.map((v, i) => rv(`<b>0${i + 1}</b><h3>${v}</h3>`, i * 0.05, 'li')).join('')}</ul></div></section>
  <section><div class="wrap split">${rv(`<h2>${a.approachT}</h2>`)}<div>${a.approach.map((x) => rv(`<p style="display:flex;gap:.7rem;padding:.8rem 0;border-bottom:1px solid var(--line)"><span style="color:var(--gold)">${icon('check', 20)}</span>${x}</p>`)).join('')}</div></div></section>
  <section class="alt"><div class="wrap"><h2 style="margin-bottom:1.5rem">${t.services.title}</h2><ul class="numlist">${t.services.list.map((s, i) => rv(`<b>0${i + 1}</b><p>${s}</p>`, 0, 'li')).join('')}</ul></div></section>
  <section style="text-align:center"><div class="wrap"><h2>${t.ctaBand.title}</h2><a href="contact.html" class="btn primary" style="margin-top:1.5rem">${t.nav.contact}</a></div></section>`;
});
