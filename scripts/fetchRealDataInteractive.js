const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function fetchWithAuth(endpoint, token, apiBase) {
  const url = `${apiBase}${endpoint}`;
  console.log(`📡 Fetching: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log(`   Status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const text = await response.text();
    console.log(`   Error body: ${text.substring(0, 200)}`);
    throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  console.log(`   Response type: ${Array.isArray(json) ? 'Array' : 'Object'}, Keys: ${Array.isArray(json) ? json.length + ' items' : Object.keys(json).join(', ')}`);
  
  return json;
}

async function main() {
  console.log('\n=== Real ma\'lumotlarni fetch qilish ===\n');
  
  const token = await question('Tokeningizni kiriting (localStorage.getItem("token")): ');
  
  if (!token || token.trim().length < 10) {
    console.error('❌ Noto\'g\'ri token!');
    rl.close();
    process.exit(1);
  }
  
  const apiBase = await question('API base URL (Enter bosing default uchun: https://api.premiumnasiya.uz/api/v1): ') || 'https://api.premiumnasiya.uz/api/v1';
  
  console.log('\n📡 Ma\'lumotlar yuklanmoqda...\n');
  
  try {
    const [usersRes, fillialsRes, applicationsRes, merchantsRes, agentsRes, adminsRes] = await Promise.all([
      fetchWithAuth('/user/all', token, apiBase).catch(e => { console.log('❌ Users:', e.message); return { items: [] }; }),
      fetchWithAuth('/fillial/all', token, apiBase).catch(e => { console.log('❌ Fillials:', e.message); return { items: [] }; }),
      fetchWithAuth('/app/all', token, apiBase).catch(e => { console.log('❌ Applications:', e.message); return { items: [] }; }),
      fetchWithAuth('/merchant/all', token, apiBase).catch(e => { console.log('❌ Merchants:', e.message); return { items: [] }; }),
      fetchWithAuth('/agent/all', token, apiBase).catch(e => { console.log('❌ Agents:', e.message); return { items: [] }; }),
      fetchWithAuth('/admin/all', token, apiBase).catch(e => { console.log('❌ Admins:', e.message); return { items: [] }; })
    ]);

    const demoData = {
      users: Array.isArray(usersRes) ? usersRes : (usersRes.items || []),
      fillials: Array.isArray(fillialsRes) ? fillialsRes : (fillialsRes.items || []),
      applications: Array.isArray(applicationsRes) ? applicationsRes : (applicationsRes.items || []),
      merchants: Array.isArray(merchantsRes) ? merchantsRes : (merchantsRes.items || []),
      agents: Array.isArray(agentsRes) ? agentsRes : (agentsRes.items || []),
      admins: Array.isArray(adminsRes) ? adminsRes : (adminsRes.items || [])
    };

    console.log('✅ Ma\'lumotlar muvaffaqiyatli yuklandi:');
    console.log(`   - Users: ${demoData.users.length}`);
    console.log(`   - Fillials: ${demoData.fillials.length}`);
    console.log(`   - Applications: ${demoData.applications.length}`);
    console.log(`   - Merchants: ${demoData.merchants.length}`);
    console.log(`   - Agents: ${demoData.agents.length}`);
    console.log(`   - Admins: ${demoData.admins.length}`);

    // Save to all apps
    const apps = [
      'premium-nasiya-dashboard',
      'premium-nasiya-agent',
      'premium-nasiya-admin'
    ];

    for (const app of apps) {
      const outputPath = path.join(__dirname, '..', '..', app, 'public', 'data', 'demoData.json');
      try {
        fs.writeFileSync(outputPath, JSON.stringify(demoData, null, 2));
        console.log(`\n💾 Saqlandi: ${app}/public/data/demoData.json`);
      } catch (err) {
        console.log(`⚠️  ${app} topilmadi, o'tkazildi`);
      }
    }

    console.log('\n✅ Tayyor! Browserda hard refresh qiling (Ctrl+Shift+R)\n');

  } catch (error) {
    console.error('\n❌ Xatolik:', error.message);
    process.exit(1);
  }
  
  rl.close();
}

main();
