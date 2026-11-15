const http = require('http');

const routes = [
  '/',
  '/?city=Tokyo',
  '/?city=Paris',
  '/?city=Burewala',
  '/mes-coupons',
  '/commercant',
  '/admin',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/conditions-generales',
  '/api/offers',
  '/api/offers?city=Tokyo&limit=1200',
  '/api/offers?city=Lahore&limit=1200',
];

async function checkRoute(r) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${r}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route: r, status: res.statusCode, length: data.length });
      });
    }).on('error', (e) => resolve({ route: r, error: e.message }));
  });
}

async function run() {
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(res);
  }
}

run();
