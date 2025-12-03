const fs = require('fs');
const path = require('path');

// Read current data
const dataPath = path.join(__dirname, '..', 'public', 'data', 'demoData.json');
const currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Generate random Uzbek phone number
function randomUzbPhone() {
  const prefixes = ['90', '91', '93', '94', '95', '97', '98', '99'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+9989${prefix}${number}`;
}

// Generate random Uzbek names
const firstNames = [
  "Aziz", "Bekzod", "Davron", "Eldor", "Farrux", "Gafur", "Hamid", "Ibrohim", "Jahongir", "Kamol",
  "Laziz", "Mansur", "Nodir", "Otabek", "Rustam", "Sanjar", "Timur", "Ulug'bek", "Vali", "Yorqin",
  "Dilnoza", "Feruza", "Gulnora", "Hilola", "Iroda", "Komila", "Laylo", "Madina", "Nigora", "Ozoda"
];

const lastNames = [
  "Karimov", "Alimov", "Rahmonov", "Yusupov", "Ibragimov", "Abdullayev", "Tursunov", "Mahmudov",
  "Sharipov", "Haydarov", "Mirzayev", "Ismoilov", "Normatov", "Qodirov", "Salimov", "Umarov",
  "Karimova", "Alimova", "Rahmonova", "Yusupova", "Ibragimova", "Abdullayeva", "Tursunova", "Mahmudova"
];

function randomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

function randomPassport() {
  const series = ['AA', 'AB', 'AC', 'AD', 'AE', 'AF'];
  const s = series[Math.floor(Math.random() * series.length)];
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `${s}${num}`;
}

// Simplified fillial names
const fillialNames = [
  "Elektron 1-do'kon", "Elektron 2-do'kon", "Elektron 3-do'kon",
  "Maishiy Texnika A", "Maishiy Texnika B", "Maishiy Texnika C",
  "Premium 1-filial", "Premium 2-filial", "Premium 3-filial",
  "Texno Savdo 1", "Texno Savdo 2", "Texno Savdo 3",
  "Arzon Market 1", "Arzon Market 2", "Arzon Market 3"
];

const regions = ["TOSHKENT_SHAHAR", "TOSHKENT", "SAMARQAND", "FARGONA", "ANDIJON", "NAMANGAN"];
const addresses = [
  "Toshkent sh., Yunusobod t., Bog'ishamol ko'chasi 1-uy",
  "Toshkent sh., Chilonzor t., Qatortol ko'chasi 2-uy",
  "Samarqand sh., Registon ko'chasi 3-uy",
  "Farg'ona sh., Margilon yo'li 4-uy",
  "Andijon sh., Navoi ko'chasi 5-uy"
];

// Clean and simplify fillials
const cleanFillials = currentData.fillials.slice(0, 15).map((f, i) => ({
  id: i + 1,
  name: fillialNames[i] || `Demo Filial ${i + 1}`,
  image: null,
  address: addresses[i % addresses.length],
  region: regions[i % regions.length],
  work_status: "WORKING",
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  merchant_id: (i % 3) + 1,
  agent_id: (i % 2) + 1,
  nds: `${300000000000 + i * 1000}`,
  hisob_raqam: `2020800050711922100${i + 1}`,
  bank_name: "XALQ BANKI",
  mfo: "00453",
  inn: `${300000000 + i * 100}`,
  director_name: `Direktor ${i + 1}`,
  director_phone: randomUzbPhone(),
  percent_type: "OUT",
  expired_months: [{ month: 12, active: true, percent: 30 }],
  cashback_percent: 2,
  cashback_amount: 0,
  max_amount: 50000000,
  timeout: 600
}));

// Clean users
const cleanUsers = currentData.users.slice(0, 20).map((u, i) => ({
  id: i + 1,
  fullname: randomName(),
  image: null,
  phone: randomUzbPhone(),
  password: null,
  role: u.role || "USER",
  work_status: "WORKING",
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  merchant_id: ((i % 3) + 1),
  fillial_id: ((i % 15) + 1),
  fillial: cleanFillials[i % 15],
  merchant: { id: ((i % 3) + 1), name: ["ARTEL", "SHIVAKI", "SAMSUNG"][i % 3] }
}));

// Clean and fix applications - make them FINISHED
const statuses = ["FINISHED", "CONFIRMED", "PENDING"];
const cleanApplications = currentData.applications.slice(0, 50).map((app, i) => {
  const status = statuses[i % 3]; // Mostly FINISHED
  const amount = Math.floor(1000000 + Math.random() * 10000000);
  const limit = Math.floor(amount * 1.3);
  const payment_amount = Math.floor(amount / 12);
  
  return {
    id: i + 1,
    fullname: randomName(),
    phone: randomUzbPhone(),
    phone2: randomUzbPhone(),
    passport: randomPassport(),
    limit: limit,
    canceled_reason: null,
    expired_month: "12",
    percent: 30,
    amount: amount,
    payment_amount: payment_amount,
    status: status,
    fillial_id: ((i % 15) + 1),
    bank_id: 1,
    request_id: `REQ${Date.now()}${i}`,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    merchant_id: ((i % 3) + 1),
    user_id: ((i % 20) + 1),
    myid_id: null,
    paid: status === "FINISHED",
    fcmToken: null,
    merchant: { id: ((i % 3) + 1), name: ["ARTEL", "SHIVAKI", "SAMSUNG"][i % 3] },
    fillial: cleanFillials[i % 15],
    user: cleanUsers[i % 20],
    products: [
      {
        id: i * 10 + 1,
        name: ["Muzlatgich", "Kir yuvish mashinasi", "Konditsioner", "Televizor", "Gaz plita"][i % 5],
        price: Math.floor(500000 + Math.random() * 5000000),
        count: 1
      }
    ]
  };
});

// Keep merchants, agents, admins simple
const cleanMerchants = [
  { id: 1, name: "ARTEL", image: null, type: "MERCHANT", work_status: "WORKING", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: "SHIVAKI", image: null, type: "MERCHANT", work_status: "WORKING", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, name: "SAMSUNG", image: null, type: "MERCHANT", work_status: "WORKING", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const cleanAgents = currentData.agents.slice(0, 5).map((a, i) => ({
  id: i + 1,
  fullname: randomName(),
  phone: randomUzbPhone(),
  role: "AGENT",
  work_status: "WORKING",
  merchant_id: ((i % 3) + 1),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

const cleanAdmins = currentData.admins.slice(0, 5).map((a, i) => ({
  id: i + 1,
  fullname: randomName(),
  phone: randomUzbPhone(),
  role: "ADMIN",
  work_status: "WORKING",
  merchant_id: ((i % 3) + 1),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

const cleanData = {
  users: cleanUsers,
  fillials: cleanFillials,
  applications: cleanApplications,
  merchants: cleanMerchants,
  agents: cleanAgents,
  admins: cleanAdmins
};

// Save to all apps
const apps = ['premium-nasiya-dashboard', 'premium-nasiya-agent', 'premium-nasiya-admin'];
for (const app of apps) {
  const outputPath = path.join(__dirname, '..', '..', app, 'public', 'data', 'demoData.json');
  try {
    fs.writeFileSync(outputPath, JSON.stringify(cleanData, null, 2));
    console.log(`✅ Saqlandi: ${app}`);
  } catch (err) {
    console.log(`⚠️  ${app} topilmadi`);
  }
}

console.log('\n📊 Demo ma\'lumotlar statistikasi:');
console.log(`   - Users: ${cleanUsers.length}`);
console.log(`   - Fillials: ${cleanFillials.length}`);
console.log(`   - Applications: ${cleanApplications.length} (FINISHED: ${cleanApplications.filter(a => a.status === 'FINISHED').length})`);
console.log(`   - Merchants: ${cleanMerchants.length}`);
console.log(`   - Agents: ${cleanAgents.length}`);
console.log(`   - Admins: ${cleanAdmins.length}`);
console.log('\n✅ Tayyor! Browserda hard refresh qiling (Ctrl+Shift+R)\n');
