require('dotenv').config(); 

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'stockacc_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Generate unique IDs
const generateAccId = async () => {
  const [rows] = await pool.execute('SELECT MAX(Acc_ID) as maxId FROM personal_data');
  const maxId = rows[0]?.maxId || 'A000';
  const num = parseInt(maxId.substring(1)) + 1;
  return `A${num.toString().padStart(3, '0')}`;
};

const generateContactId = async () => {
  const [rows] = await pool.execute('SELECT MAX(Contact_ID) as maxId FROM contact_person_details');
  const maxId = rows[0]?.maxId || 'C0000';
  const num = parseInt(maxId.substring(1)) + 1;
  return `C${num.toString().padStart(4, '0')}`;
};

const generateFundingId = async () => {
  const [rows] = await pool.execute('SELECT MAX(Funding_ID) as maxId FROM source_of_funding');
  const maxId = rows[0]?.maxId || 'F000000';
  const num = parseInt(maxId.substring(1)) + 1;
  return `F${num.toString().padStart(6, '0')}`;
};

const generateBankAccNo = () => {
  // Generate random 19-digit bank account number
  return Math.random().toString().slice(2, 21).padStart(19, '0');
};

module.exports = {
  pool,
  testConnection,
  generateAccId,
  generateContactId,
  generateFundingId,
  generateBankAccNo
};
