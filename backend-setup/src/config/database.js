
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Generate 4-character Account ID with uniqueness check against personal_data table
const generateAccId = async () => {
  let accId;
  let exists = true;

  while (exists) {
    // Random 4-character alphanumeric string
    accId = Math.random().toString(36).substring(2, 6).toUpperCase();

    // Check if accId already exists in personal_data table
    const [rows] = await pool.query('SELECT 1 FROM personal_data WHERE Acc_ID = ?', [accId]);
    exists = rows.length > 0;
  }

  return accId;
};

// Generate Contact ID without uniqueness check (add if needed)
const generateContactId = () => {
  return 'CON-' + (Math.random().toString(16).slice(2, 10)).toUpperCase();
};

// Short Funding ID (7 characters)
const generateFundingId = () => {
  // 'F' + 6 alphanumeric characters = 7 total
  return 'F' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate Bank Account Number (10-digit random number string)
const generateBankAccNo = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

module.exports = {
  pool,
  generateAccId,
  generateContactId,
  generateFundingId,
  generateBankAccNo
};
