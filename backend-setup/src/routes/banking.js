
const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Verify bank account
router.post('/verify-account', async (req, res) => {
  try {
    const { accountNumber, accountHolderName, bankName } = req.body;

    // Simple verification logic (you can enhance this)
    const [rows] = await pool.execute(
      'SELECT * FROM bank_details WHERE Bank_Acc_No = ? AND Bank_Acc_Name = ? AND Bank_Name = ?',
      [accountNumber, accountHolderName, bankName]
    );

    res.json({
      data: {
        verified: rows.length > 0,
        message: rows.length > 0 ? 'Account verified successfully' : 'Account verification failed'
      }
    });

  } catch (error) {
    console.error('Bank verification error:', error);
    res.status(500).json({ error: 'Verification failed', message: error.message });
  }
});

// Get bank options
router.get('/bank-options', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT DISTINCT Bank_Name as name, Bank_Name as code FROM bank_details ORDER BY Bank_Name'
    );

    res.json({
      data: rows.map((row, index) => ({
        id: index + 1,
        name: row.name,
        code: row.code
      }))
    });

  } catch (error) {
    console.error('Get bank options error:', error);
    res.status(500).json({ error: 'Failed to get bank options', message: error.message });
  }
});

// Get branch options
router.get('/branch-options/:bankId', async (req, res) => {
  try {
    const { bankId } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT DISTINCT Branch as name, Branch as code FROM bank_details WHERE Bank_Name = ? ORDER BY Branch',
      [bankId]
    );

    res.json({
      data: rows.map((row, index) => ({
        id: index + 1,
        name: row.name,
        address: `${row.name} Branch`,
        code: row.code
      }))
    });

  } catch (error) {
    console.error('Get branch options error:', error);
    res.status(500).json({ error: 'Failed to get branch options', message: error.message });
  }
});

module.exports = router;
