App.init('home', () => {
  const t = tr(), L = App.lang, s = App.data.settings;
  const headline = s.heroHeadline?.[L] || t.hero.headline;
  const sIcons = ['code', 'grad', 'compass'], sIdx = [0, 1, 3];
  const fc = App.data.courses.filter((c) => c.status === 'published').slice(0, 3);
  const fp = App.data.projects.filter((p) => p.status === 'published').slice(0, 3);
  document.getElementById('app').innerHTML = `
  <section class="hero" aria-labelledby="hero-h"><div class="wrap hero-grid"><div>
    <p class="eyebrow a" style="--d:.3s">${t.tagline}</p>
    <h1 id="hero-h" class="gold a" style="--d:.5s">${esc(headline)}</h1>
    <ul class="chips" style="list-style:none;padding:0">${t.hero.services.map((x, i) => `<li class="chip a" style="--d:${0.9 + i * 0.12}s">${x}</li>`).join('')}</ul>
    <p class="closing a" style="--d:1.4s">${t.hero.closing}</p>
    <div class="row a" style="--d:1.6s"><a href="#services" class="btn primary">${t.hero.cta1}${icon('arrow', 18, 'arrow')}</a><a href="contact.html" class="btn ghost">${t.hero.cta2}</a></div></div>
    <div class="logo-stage"><img class="logo" src="assets/logo.jpg" alt="Do Tech Group" width="460" height="460" style="width:100%;max-width:460px;filter:drop-shadow(0 0 40px rgba(214,170,85,.25))"></div></div></section>
  <section id="services"><div class="wrap">${rv(`<p class="eyebrow">${t.services.title}</p>`)}
    <div class="grid">${t.hero.services.map((x, i) => rv(`<div class="card"><div class="body"><span style="color:var(--gold)">${icon(sIcons[i], 30)}</span><h3>${x}</h3><p>${t.services.list[sIdx[i]]}</p></div></div>`, i * 0.1)).join('')}</div></div></section>
  <section class="alt"><div class="wrap split">
    ${rv(`<p class="eyebrow">${t.about.title}</p><h2>${t.about.missionT}</h2><p class="gold" style="font-size:1.3rem;margin-top:1rem">${t.about.mission}</p>`)}
    ${rv(`<p class="lead">${t.about.p[0]}</p><a href="about.html" class="btn ghost" style="margin-top:1.5rem">${t.about.more}${icon('arrow', 16, 'arrow')}</a>`, 0.1)}</div></section>
  <section><div class="wrap split">${rv(`<h2>${t.why.title}</h2>`)}
    <ol class="numlist">${t.why.items.map(([h, d], i) => rv(`<b>0${i + 1}</b><div><h3>${h}</h3><p class="muted">${d}</p></div>`, i * 0.08, 'li')).join('')}</ol></div></section>
  <section class="alt"><div class="wrap">
    <div class="row" style="justify-content:space-between;align-items:end;margin-bottom:2rem"><h2>${t.featured.courses}</h2><a href="courses.html" class="btn ghost sm">${t.featured.all}</a></div>
    <div class="grid">${fc.map(courseCard).join('')}</div></div></section>
  <section><div class="wrap">
    <div class="row" style="justify-content:space-between;align-items:end;margin-bottom:2rem"><h2>${t.featured.projects}</h2><a href="projects.html" class="btn ghost sm">${t.featured.all}</a></div>
    <div class="grid">${fp.map(projectCard).join('')}</div></div></section>
  <section><div class="wrap">${rv(`<h2>${t.career.title}</h2><p class="lead" style="margin:1rem 0 1.5rem">${t.career.text}</p><a href="courses.html" class="btn primary">${t.career.cta}</a>`, 0, 'div', 'band')}</div></section>
  <section style="text-align:center"><div class="wrap">${rv(`<h2>${t.ctaBand.title}</h2><p class="lead" style="margin:1rem auto 1.5rem">${t.ctaBand.text}</p><a href="contact.html" class="btn primary">${t.nav.contact}</a>`)}</div></section>`;
});
