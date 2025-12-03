// Simple API test script
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testApi() {
  console.log('\n=== API Test ===\n');
  
  const token = await question('Token: ');
  const apiBase = await question('API Base (default: https://api.premiumnasiya.uz/api/v1): ') || 'https://api.premiumnasiya.uz/api/v1';
  
  console.log('\n🔍 Testing /user/all endpoint...\n');
  
  try {
    const response = await fetch(`${apiBase}/user/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('\nRaw Response:', text.substring(0, 500));
    
    try {
      const json = JSON.parse(text);
      console.log('\nParsed JSON:', JSON.stringify(json, null, 2).substring(0, 500));
      
      if (json.items) {
        console.log('\n✅ Items found:', json.items.length);
      } else if (Array.isArray(json)) {
        console.log('\n✅ Array response:', json.length, 'items');
      } else {
        console.log('\n⚠️  Response structure:', Object.keys(json));
      }
    } catch (e) {
      console.log('\n❌ Failed to parse JSON:', e.message);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
  
  rl.close();
}

testApi();
