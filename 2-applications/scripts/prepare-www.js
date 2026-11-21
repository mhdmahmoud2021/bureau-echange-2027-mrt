// Copie le site (../1-site-web/site) dans www/ et rend les bibliothèques locales
// (l'application marche même sans réseau au démarrage ; Supabase reste en ligne).
const fs = require('fs'), path = require('path'), https = require('https');
const ROOT = path.join(__dirname, '..');
const SRC = process.env.SITE_DIR || path.join(ROOT, '..', '1-site-web', 'site');
const OUT = path.join(ROOT, 'www');
const LIBS = {
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js': 'vendor/supabase.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js': 'vendor/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js': 'vendor/html2canvas.min.js'
};
function copyDir(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const f of fs.readdirSync(a)) {
    const p = path.join(a, f), q = path.join(b, f);
    fs.statSync(p).isDirectory() ? copyDir(p, q) : fs.copyFileSync(p, q);
  }
}
function get(url) {
  return new Promise((ok, ko) => https.get(url, r => {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return get(r.headers.location).then(ok, ko);
    if (r.statusCode !== 200) return ko(new Error(url + ' → ' + r.statusCode));
    const c = []; r.on('data', d => c.push(d)); r.on('end', () => ok(Buffer.concat(c)));
  }).on('error', ko));
}
(async () => {
  if (!fs.existsSync(path.join(SRC, 'index.html'))) { console.error('Site introuvable : ' + SRC); process.exit(1); }
  fs.rmSync(OUT, { recursive: true, force: true });
  copyDir(SRC, OUT);
  // la console vendeur (admin.html) ne va jamais dans les applications des clients
  for (const f of ['_headers', '_redirects', 'admin.html']) fs.rmSync(path.join(OUT, f), { force: true });
  // numéro de version visible dans « Mon profil »
  try { const v = require(path.join(ROOT, 'package.json')).version; const p = path.join(OUT, 'index.html');
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('<head>', '<head><script>window.BE_VERSION=' + JSON.stringify(v) + '</script>')); } catch (e) { }
  fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });
  for (const [url, rel] of Object.entries(LIBS)) {
    try { fs.writeFileSync(path.join(OUT, rel), await get(url)); console.log('ok  ' + rel); }
    catch (e) { console.warn('!! ' + e.message + ' (le lien internet sera gardé)'); continue; }
    for (const h of ['index.html', 'admin.html']) {
      const p = path.join(OUT, h); if (!fs.existsSync(p)) continue;
      fs.writeFileSync(p, fs.readFileSync(p, 'utf8').split(url).join(rel));
    }
  }
  // Capacitor (bouton retour Android…) : la bibliothèque est copiée si elle est installée
  const capJs = path.join(ROOT, 'node_modules', '@capacitor', 'core', 'dist', 'capacitor.js');
  const hasCap = fs.existsSync(capJs);
  if (hasCap) fs.copyFileSync(capJs, path.join(OUT, 'vendor', 'capacitor.js'));
  // Pas de service worker dans l'application (les fichiers sont déjà dans l'appli)
  for (const h of ['index.html', 'admin.html']) {
    const p = path.join(OUT, h); if (!fs.existsSync(p)) continue;
    let s = fs.readFileSync(p, 'utf8');
    s = s.replace(/<script>if\("serviceWorker"[^<]*<\/script>/, '');
    s = s.replace('<head>', '<head>\n<script>window.BE_APP=true;</script>' + (hasCap && h === 'index.html' ? '\n<script src="vendor/capacitor.js"></script>' : ''));
    fs.writeFileSync(p, s);
  }
  console.log('www/ prêt depuis ' + SRC);
})();
