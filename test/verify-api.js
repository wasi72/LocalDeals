const http = require('http');

const cities = [
  'Tokyo', 'New York', 'London', 'Paris', 'Lahore', 
  'Karachi', 'Burewala', 'Chichawatni', 'Dubai', 'Rome', 
  'Toronto', 'Singapore', 'Sydney', 'Berlin', 'Los Angeles'
];

async function checkCity(city) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000/api/offers?city=${encodeURIComponent(city)}&limit=1`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(`${city.padEnd(14)}: ${json.totalCount} deals (Currency: ${json.offers[0]?.currency || 'N/A'})`);
        } catch (e) {
          resolve(`${city.padEnd(14)}: Error parsing response - ${e.message}`);
        }
      });
    }).on('error', (e) => resolve(`${city.padEnd(14)}: Request error - ${e.message}`));
  });
}

async function run() {
  console.log('--- API VERIFICATION FOR ALL CITIES (TARGET >= 500 DEALS) ---');
  for (const city of cities) {
    const res = await checkCity(city);
    console.log(res);
  }
  
  // Also verify worldwide total
  http.get('http://localhost:3000/api/offers?limit=1', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      console.log('---------------------------------------------------------');
      console.log(`Worldwide Total: ${json.totalCount} active deals in database!`);
    });
  });
}

run();
