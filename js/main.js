const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)], EMAIL = 'carterharrington40@gmail.com';
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.k); toast.k = setTimeout(() => t.classList.remove('on'), 4200) };
// Chatbot (Tawk.to)
function openChat() { if (window.Tawk_API && typeof Tawk_API.maximize === 'function') { try { Tawk_API.showWidget && Tawk_API.showWidget(); Tawk_API.maximize() } catch (e) { } } else toast('The chat widget is still loading. If it does not appear, it may be blocked on this page.') }
$$('[data-chat]').forEach(b => b.onclick = openChat);
// Mobile menu 
const nav = $('#nav'), bg = $('#burger'); bg.onclick = () => { const o = nav.classList.toggle('open'); bg.setAttribute('aria-expanded', o) }; $$('#nav a').forEach(a => a.onclick = () => { nav.classList.remove('open'); bg.setAttribute('aria-expanded', false) });
if (window.gsap && !matchMedia('(prefers-reduced-motion:reduce)').matches) gsap.from('.hero h1,.hero .lead,.hero .row,.pills,.frame', { y: 34, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out' });
// Demo site filters + search
let fil = 'all'; const lsx = $$('.ls');
function filt() { const q = $('#q').value.toLowerCase().trim(); lsx.forEach(l => l.classList.toggle('hide', !((fil === 'all' || l.dataset.t === fil) && l.textContent.toLowerCase().includes(q)))) }
$$('#fl button').forEach(b => b.onclick = () => { fil = b.dataset.f; $$('#fl button').forEach(x => x.classList.toggle('on', x === b)); filt() }); $('#q').oninput = filt;
// Night-in-your-inbox scroll story
const M = [['18:42', 'Is the Clapham flat still available?', 'Hi, yes it is. Would you like to view it this week?'],
['20:15', 'Can I view the Albion Road house on Saturday morning?', 'Saturday 10:30 is free. I have pencilled you in.'],
['21:58', 'What are the service charges on the Hampstead apartment?', 'They are €3,100 a year. I can send the full breakdown.'],
['23:47', 'Do you accept pets? We are moving from Dublin next month.', 'Yes, with a small deposit. Shall I book a video tour?'],
['02:10', 'Could I get the floor plan for Hartfield Barns?', 'Sending the floor plan to your email now.'],
['06:35', 'Is the Northfield Gardens development still selling?', 'Yes, 4 plots remain. I can reserve a viewing.'],
['08:20', 'Ready to make an offer. Who do I speak to?', 'Passing you to an agent now with your details.']];
const feed = $('#feed'); let mode = 'off';
feed.innerHTML = M.map((m, i) => `<div class="mc" data-i="${i}"><small>${m[0]}</small>${m[1]}<div class="st"></div></div>`).reverse().join('');
const cards = $$('.mc'), st = $('#story'); let shown = 0;
function paint() {
  cards.forEach(c => { const m = M[c.dataset.i]; c.querySelector('.st').innerHTML = mode === 'on' ? `<span class="good">Reya, in 4 seconds: ${m[2]}</span>` : '<span class="bad">No reply. Buyer moves on.</span>' });
  $('#l1').textContent = mode === 'on' ? 'Enquiries answered' : 'Enquiries unanswered'; $('#l2').textContent = mode === 'on' ? 'Viewings kept in your diary' : 'Potential fees at risk'; meter()
}
function meter() { $('#m1').textContent = shown; $('#m2').textContent = mode === 'on' ? Math.round(shown * .6) : '€' + (shown * 2400).toLocaleString('en-GB') }
function tick() {
  const r = st.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  const mins = Math.round(p * 15 * 60) + 18 * 60, h = Math.floor(mins / 60) % 24, mm = mins % 60; $('#clock').textContent = String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  let n = 0; cards.forEach(c => { const t = M[c.dataset.i][0].split(':'), tm = (+t[0] < 18 ? +t[0] + 24 : +t[0]) * 60 + +t[1], vis = mins >= tm; c.classList.toggle('show', vis); if (vis) n++ });
  shown = n; $('#cnt').textContent = n + ' new'; meter()
}
$$('#seg button').forEach(b => b.onclick = () => { mode = b.dataset.m; $$('#seg button').forEach(x => x.classList.toggle('on', x === b)); paint() });
addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true }); addEventListener('resize', tick); paint(); tick();
// Pricing -> contact preselect
function setSv(v) { const r = $$('input[name=sv]').find(x => x.value === v); if (r) r.checked = true }
$$('[data-service]').forEach(a => a.onclick = () => { setSv(a.dataset.service); if (!$('#wizbody').hidden) show(s); toast('Selected: ' + a.dataset.service) });
// Multi-step form
let s = 0; const panes = $$('.pane'), dots = $$('.dotn'), V = { 0: [['n', v => v.trim().length > 1, 'Enter your name'], ['e', v => /^\S+@\S+\.\S+$/.test(v), 'Enter a valid email']], 1: [], 2: [['m', v => v.trim().length > 9, 'Describe your agency in at least 10 characters']] };
const sv = () => ($('input[name=sv]:checked') || {}).value;
function show(i) {
  s = i; panes.forEach((p, k) => p.classList.toggle('on', k === i)); dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('done', k < i); d.firstChild.textContent = k < i ? '✓' : k + 1 });
  $('#fill').style.width = `calc(${i / 3 * 100}% - ${i / 3 * 38}px)`; $('#back').style.visibility = i ? 'visible' : 'hidden'; $('#next2').textContent = i == 3 ? 'Send enquiry' : 'Continue';
  if (i == 3) { const g = id => $('#' + id).value || '-'; $('#sum').innerHTML = `<div><b>Name</b>${g('n')}</div><div><b>Email</b>${g('e')}</div><div><b>Agency</b>${g('ag')}</div><div><b>Service</b>${sv() || '-'}</div><div><b>Budget</b>${g('bd')}</div><div><b>Timeline</b>${g('tl')}</div><div><b>About</b>${g('m')}</div>` }
}
function ok() { let good = true; (V[s] || []).forEach(([id, f, msg]) => { const el = $('#' + id), g = f(el.value); el.classList.toggle('invalid', !g); $('#' + id + 'x').textContent = g ? '' : msg; if (!g) good = false }); if (s === 1 && !sv()) { toast('Choose a service to continue'); good = false } return good }
$('#back').onclick = () => show(s - 1);
$('#next2').onclick = () => {
  if (!ok()) return; if (s < 3) return show(s + 1); const g = id => $('#' + id).value, body = `Name: ${g('n')}\nEmail: ${g('e')}\nAgency: ${g('ag') || '-'}\nService: ${sv()}\nBudget: ${g('bd')}\nTimeline: ${g('tl')}\n\n${g('m')}`;
  $('#wizbody').hidden = true; $('#ok').hidden = false; location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('New enquiry from ' + g('n'))}&body=${encodeURIComponent(body)}`
};
$('#retry').onclick = () => { $('#ok').hidden = true; $('#wizbody').hidden = false; show(3) };
show(0);
