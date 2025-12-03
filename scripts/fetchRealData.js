const fs = require('fs');
const path = require('path');

// Token-ni shu yerga qo'ying
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiU1VQRVIiLCJpYXQiOjE3NjI4NDk1MjAsImV4cCI6MTc2NTQ0MTUyMH0.hTlKh_s19x2cFbq-KQ-9oO6QvtXuzo-bENHRnmlTqR8'; // localStorage-dan olgan tokeningizni bu yerga qo'ying
const API_BASE = 'https://api.premiumnasiya.uz/api/v1'; // Yoki sizning API manzil

async function fetchWithAuth(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchAllData() {
  console.log('Fetching data from API...');
  
  try {
    // Barcha ma'lumotlarni parallel ravishda olish
    const [usersRes, fillialsRes, applicationsRes, merchantsRes, agentsRes, adminsRes] = await Promise.all([
      fetchWithAuth('/user/all').catch(() => ({ items: [] })),
      fetchWithAuth('/fillial/all').catch(() => ({ items: [] })),
      fetchWithAuth('/app/all').catch(() => ({ items: [] })),
      fetchWithAuth('/merchant/all').catch(() => ({ items: [] })),
      fetchWithAuth('/agent/all').catch(() => ({ items: [] })),
      fetchWithAuth('/admin/all').catch(() => ({ items: [] }))
    ]);

    const demoData = {
      users: Array.isArray(usersRes) ? usersRes : (usersRes.items || []),
      fillials: Array.isArray(fillialsRes) ? fillialsRes : (fillialsRes.items || []),
      applications: Array.isArray(applicationsRes) ? applicationsRes : (applicationsRes.items || []),
      merchants: Array.isArray(merchantsRes) ? merchantsRes : (merchantsRes.items || []),
      agents: Array.isArray(agentsRes) ? agentsRes : (agentsRes.items || []),
      admins: Array.isArray(adminsRes) ? adminsRes : (adminsRes.items || [])
    };

    console.log('Data fetched successfully:');
    console.log(`- Users: ${demoData.users.length}`);
    console.log(`- Fillials: ${demoData.fillials.length}`);
    console.log(`- Applications: ${demoData.applications.length}`);
    console.log(`- Merchants: ${demoData.merchants.length}`);
    console.log(`- Agents: ${demoData.agents.length}`);
    console.log(`- Admins: ${demoData.admins.length}`);

    // Save to file
    const outputPath = path.join(__dirname, '..', 'public', 'data', 'demoData.json');
    fs.writeFileSync(outputPath, JSON.stringify(demoData, null, 2));
    console.log(`\nData saved to: ${outputPath}`);

  } catch (error) {
    console.error('Error fetching data:', error.message);
    process.exit(1);
  }
}

// Check if TOKEN is set
if (TOKEN === 'your-token-here') {
  console.error('\n❌ ERROR: Please set your TOKEN in the script first!');
  console.error('1. Open browser DevTools (F12)');
  console.error('2. Go to Console tab');
  console.error('3. Type: localStorage.getItem("token")');
  console.error('4. Copy the token value');
  console.error('5. Replace "your-token-here" in this script with your token');
  console.error('6. Run: node scripts/fetchRealData.js\n');
  process.exit(1);
}

fetchAllData();
