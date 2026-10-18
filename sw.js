// 수드 악보 연주 패드판 — 인터넷 없이도 열리게 앱 파일과 악기 소리를 패드에 담아 둔다 (build-pad.py 가 만듦)
const VER = 'ssp-v2.2.2';
const CORE = ["./", "index.html", "manifest.webmanifest", "icon.png", "LICENSES.txt", "sood-guide.js", "sood-guide-helps.js", "vendor/opensheetmusicdisplay-1.9.9.min.js", "img/sood-192.jpg", "sounds/acoustic_bass.js", "sounds/acoustic_grand_piano.js", "sounds/alto_sax.js", "sounds/baritone_sax.js", "sounds/clarinet.js", "sounds/contrabass.js", "sounds/flute.js", "sounds/french_horn.js", "sounds/index.json", "sounds/LICENSE.txt", "sounds/oboe.js", "sounds/soprano_sax.js", "sounds/tenor_sax.js", "sounds/trombone.js", "sounds/trumpet.js", "sounds/tuba.js"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // 화면(index)은 인터넷이 되면 새것, 안 되면 담아 둔 것
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VER).then(c => c.put('index.html', cp)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(VER).then(c => c.put(req, cp)); }
    return r;
  })));
});
