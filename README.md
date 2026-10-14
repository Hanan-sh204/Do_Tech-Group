# Do Tech Group — Vanilla HTML/CSS/JS

Static site, no build step, no npm. Arabic is the default language (RTL); English switches to LTR. Language and data persist in localStorage (`dotech.v1.*`).

## Run
`python3 -m http.server 8000` then open http://localhost:8000 — or upload the folder to any static host. (Opening the files directly also works.)

## Pages
index.html, about.html, courses.html, projects.html, contact.html, admin.html

## Notes
- `js/translations.js` holds all AR/EN copy; `js/data.js` the sample data; `js/main.js` shared shell, modals, cards.
- admin.html is a **demo preview**: no authentication, data lives in this browser only.
- The contact form opens WhatsApp (wa.me) with a ready message to the number set in WHATSAPP_NUMBER (js/contact.js). Nothing is sent until the visitor presses send inside WhatsApp. Messages are also kept locally for the admin Messages tab.
- All courses/projects/messages are labeled sample data. Phone is set in js/data.js (seedSettings.phone); email is still a placeholder until you set seedSettings.email.
- Fonts load from Google Fonts. Logo is the supplied JPG (assets/logo.jpg).
