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

// Generate incremental Account ID (e.g., A001, A002, etc.)
const generateAccId = async () => {
  const [rows] = await pool.query(
    'SELECT Acc_ID FROM personal_data ORDER BY Acc_ID DESC LIMIT 1'
  );
  
  let lastNum = 0;
  if (rows.length > 0) {
    // Extract number from last ID (e.g., 'A001' -> 1)
    const lastId = rows[0].Acc_ID;
    lastNum = parseInt(lastId.substring(1)) || 0;
  }
  
  // Increment and pad with zeros
  const newNum = (lastNum + 1).toString().padStart(3, '0');
  return `A${newNum}`;
};

// Generate incremental Contact ID (e.g., CON-001, CON-002, etc.)
const generateContactId = async () => {
  const [rows] = await pool.query(
    'SELECT Contact_ID FROM contact_details ORDER BY Contact_ID DESC LIMIT 1'
  );
  
  let lastNum = 0;
  if (rows.length > 0) {
    // Extract number from last ID (e.g., 'CON-001' -> 1)
    const lastId = rows[0].Contact_ID;
    const matches = lastId.match(/CON-(\d+)/);
    if (matches) {
      lastNum = parseInt(matches[1]) || 0;
    }
  }
  
  // Increment and pad with zeros
  const newNum = (lastNum + 1).toString().padStart(3, '0');
  return `CON-${newNum}`;
};

// Generate incremental Funding ID (e.g., F0001, F0002, etc.)
const generateFundingId = async () => {
  const [rows] = await pool.query(
    'SELECT Funding_ID FROM funding_source ORDER BY Funding_ID DESC LIMIT 1'
  );
  
  let lastNum = 0;
  if (rows.length > 0) {
    // Extract number from last ID (e.g., 'F0001' -> 1)
    const lastId = rows[0].Funding_ID;
    lastNum = parseInt(lastId.substring(1)) || 0;
  }
  
  // Increment and pad with zeros
  const newNum = (lastNum + 1).toString().padStart(4, '0');
  return `F${newNum}`;
};

// Generate incremental Bank Account Number (10 digits, starting from 1000000001)
const generateBankAccNo = async () => {
  const [rows] = await pool.query(
    'SELECT Bank_Acc_No FROM bank_details ORDER BY Bank_Acc_No DESC LIMIT 1'
  );
  
  let lastNum = 1000000000; // Starting number
  if (rows.length > 0) {
    lastNum = parseInt(rows[0].Bank_Acc_No) || 1000000000;
  }
  
  return (lastNum + 1).toString();
};

module.exports = {
  pool,
  generateAccId,
  generateContactId,
  generateFundingId,
  generateBankAccNo
};
