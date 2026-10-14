// Number the form opens in WhatsApp (international format, no "+" or leading zero): 0987177510 -> 963987177510
const WHATSAPP_NUMBER = '963987177510';
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sp = new URLSearchParams(location.search);
const CS = { f: { name: '', email: '', phone: '', type: Number(sp.get('type')) || 0, message: sp.get('ref') ? sp.get('ref') + '\n' : '' }, errs: {}, state: null };
function contactRender() {
  const t = tr(), c = t.contact, s = App.data.settings, e = CS.errs, ph = (k) => `<span class="muted">${c[k]}</span>`;
  const ap = (id) => `id="${id}" aria-invalid="${!!e[id]}"${e[id] ? ` aria-describedby="${id}-e"` : ''}`;
  const er = (id) => (e[id] ? `<span id="${id}-e" class="err" role="alert">${e[id]}</span>` : '');
  document.getElementById('app').innerHTML = `
  <section class="pagehead"><div class="wrap"><p class="eyebrow">${t.nav.contact}</p><h1 class="gold">${c.title}</h1><p class="lead">${c.intro}</p></div></section>
  <section style="padding-top:1rem"><div class="wrap split">
    <div><p>${c.emailLabel}: ${esc(s.email) || ph('placeholderEmail')}</p><p>${c.phoneLabel}: ${s.phone ? `<bdi dir="ltr">${esc(s.phone)}</bdi>` : ph('placeholderPhone')}</p></div>
    <form id="cf" novalidate><p class="notice">${c.demo}</p>
      <div class="two"><div class="field"><label for="name">${c.name}</label><input ${ap('name')} name="name" autocomplete="name" value="${esc(CS.f.name)}">${er('name')}</div>
        <div class="field"><label for="email">${c.email}</label><input type="email" ${ap('email')} name="email" autocomplete="email" value="${esc(CS.f.email)}">${er('email')}</div></div>
      <div class="two"><div class="field"><label for="phone">${c.phone}</label><input type="tel" id="phone" name="phone" autocomplete="tel" value="${esc(CS.f.phone)}"></div>
        <div class="field"><label for="type">${c.type}</label><select id="type" name="type">${c.types.map((x, i) => `<option value="${i}"${CS.f.type === i ? ' selected' : ''}>${x}</option>`).join('')}</select></div></div>
      <div class="field"><label for="message">${c.message}</label><textarea rows="6" ${ap('message')} name="message">${esc(CS.f.message)}</textarea>${er('message')}</div>
      <button class="btn primary">${c.send}</button>
      <div aria-live="polite" style="margin-top:1rem">${CS.state === 'wa' ? `<p class="notice">${c.okWa}</p>` : ''}</div></form></div></section>`;
  const form = document.getElementById('cf');
  form.addEventListener('input', (ev) => { CS.f[ev.target.name] = ev.target.name === 'type' ? Number(ev.target.value) : ev.target.value; });
  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); const f = CS.f, er2 = {};
    if (!f.name.trim()) er2.name = c.errors.name;
    if (!emailRe.test(f.email)) er2.email = c.errors.email;
    if (f.message.trim().length < 10) er2.message = c.errors.message;
    CS.errs = er2; CS.state = null;
    if (Object.keys(er2).length) return contactRender();
    const L = tr().contact;
    const text = [`${L.name}: ${f.name.trim()}`, `${L.emailLabel}: ${f.email.trim()}`, f.phone.trim() && `${L.phoneLabel}: ${f.phone.trim()}`, `${L.type}: ${L.types[f.type]}`, `${L.message}:`, f.message.trim()].filter(Boolean).join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    // Local copy for the admin "Messages" tab (browser only)
    App.data.messages.unshift({ id: 'l' + Date.now().toString(36), name: f.name, email: f.email, type: f.type, message: f.message, read: false, demo: false }); App.save('messages');
    CS.state = 'wa'; CS.f = { ...f, name: '', email: '', phone: '', message: '' };
    const w = window.open(url, '_blank'); if (w) w.opener = null; else { location.href = url; return; }
    contactRender();
  });
}
App.init('contact', contactRender);
