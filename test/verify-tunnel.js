const https = require('https');

const tunnelUrl = 'https://trees-transparent-rainbow-webcams.trycloudflare.com';

function fetchUrl(path) {
  return new Promise((resolve) => {
    https.get(`${tunnelUrl}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, totalCount: json.totalCount, sample: json.offers?.[0]?.title });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message, preview: data.slice(0, 100) });
        }
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function verify() {
  console.log(`Checking live tunnel: ${tunnelUrl}`);
  
  const worldwide = await fetchUrl('/api/offers?limit=5');
  console.log('Worldwide:', worldwide);

  const tokyo = await fetchUrl('/api/offers?city=Tokyo&limit=5');
  console.log('Tokyo:', tokyo);

  const ny = await fetchUrl('/api/offers?city=New%20York&limit=5');
  console.log('New York:', ny);

  const burewala = await fetchUrl('/api/offers?city=Burewala&limit=5');
  console.log('Burewala:', burewala);
}

verify();
