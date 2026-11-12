const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2 });

async function api(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' };
  if (getToken()) headers.Authorization = 'Bearer ' + getToken();
  const res = await fetch('/api' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && getToken()) logout();
  if (!res.ok) throw new Error(data.message || 'Error ' + res.status);
  return data;
}
function logout() { localStorage.clear(); location.href = '/index.html'; }
function msg(id, text, ok) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
}
function initPage() {
  if (!getToken()) { location.href = '/index.html'; return; }
  const u = getUser(), here = location.pathname;
  const link = (href, t) => `<a href="${href}" class="${here.endsWith(href) ? 'on' : ''}">${t}</a>`;
  document.getElementById('nav').innerHTML = `<b>CajaPro</b>${link('/productos.html', 'Productos')}${link('/venta.html', 'Nueva venta')}<span class="sp"></span><span>${esc(u.nombre)} (${esc(u.rol)})</span><button class="sec" onclick="logout()">Salir</button>`;
}