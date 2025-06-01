
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile/:accId', authenticateToken, async (req, res) => {
  try {
    const { accId } = req.params;

    // Get personal data
    const [personalRows] = await pool.execute(
      'SELECT * FROM personal_data WHERE Acc_ID = ?',
      [accId]
    );

    if (personalRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const personal = personalRows[0];

    // Get bank details
    const [bankRows] = await pool.execute(
      'SELECT * FROM bank_details WHERE Bank_Acc_No = ?',
      [personal.Bank_Acc_No]
    );

    // Get funding source
    const [fundingRows] = await pool.execute(
      'SELECT * FROM source_of_funding WHERE Funding_ID = ?',
      [personal.Funding_ID]
    );

    // Get contacts
    const [contactRows] = await pool.execute(
      `SELECT cd.*, rc.C_Role, rc.C_Relationship 
       FROM contact_person_details cd
       JOIN role_of_contact rc ON cd.Contact_ID = rc.Contact_ID
       WHERE rc.Acc_ID = ?`,
      [accId]
    );

    res.json({
      data: {
        personalData: personal,
        bankDetails: bankRows[0] || null,
        sourceOfFunding: fundingRows[0] || null,
        contacts: contactRows
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile', message: error.message });
  }
});

// Update user profile
router.put('/profile/:accId', authenticateToken, async (req, res) => {
  try {
    const { accId } = req.params;
    const { personalData, bankDetails, sourceOfFunding } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update personal data
      if (personalData) {
        const fields = Object.keys(personalData).filter(key => personalData[key] !== undefined);
        if (fields.length > 0) {
          const setClause = fields.map(field => `${field} = ?`).join(', ');
          const values = fields.map(field => personalData[field]);
          
          await connection.execute(
            `UPDATE personal_data SET ${setClause} WHERE Acc_ID = ?`,
            [...values, accId]
          );
        }
      }

      // Update bank details
      if (bankDetails) {
        const [bankAccNo] = await connection.execute(
          'SELECT Bank_Acc_No FROM personal_data WHERE Acc_ID = ?',
          [accId]
        );
        
        if (bankAccNo.length > 0) {
          const fields = Object.keys(bankDetails).filter(key => bankDetails[key] !== undefined);
          if (fields.length > 0) {
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => bankDetails[field]);
            
            await connection.execute(
              `UPDATE bank_details SET ${setClause} WHERE Bank_Acc_No = ?`,
              [...values, bankAccNo[0].Bank_Acc_No]
            );
          }
        }
      }

      // Update funding source
      if (sourceOfFunding) {
        const [fundingId] = await connection.execute(
          'SELECT Funding_ID FROM personal_data WHERE Acc_ID = ?',
          [accId]
        );
        
        if (fundingId.length > 0) {
          const fields = Object.keys(sourceOfFunding).filter(key => sourceOfFunding[key] !== undefined);
          if (fields.length > 0) {
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => sourceOfFunding[field]);
            
            await connection.execute(
              `UPDATE source_of_funding SET ${setClause} WHERE Funding_ID = ?`,
              [...values, fundingId[0].Funding_ID]
            );
          }
        }
      }

      await connection.commit();
      res.json({ message: 'Profile updated successfully' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
});

module.exports = router;
