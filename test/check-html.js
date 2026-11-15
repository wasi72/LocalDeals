const https = require('https');

https.get('https://trees-transparent-rainbow-webcams.trycloudflare.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    // Check if localhost:3000 is inside the HTML!
    const hasLocalhost = data.includes('localhost:3000');
    console.log('Contains localhost:3000?:', hasLocalhost);
    
    if (hasLocalhost) {
      const idx = data.indexOf('localhost:3000');
      console.log('Snippet around localhost:3000:');
      console.log(data.slice(Math.max(0, idx - 150), idx + 250));
    }
  });
}).on('error', err => console.error('Error:', err.message));
