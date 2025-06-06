const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to format date for MySQL
const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // If it's an ISO string, extract date part
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  return date.toISOString().split('T')[0];
};

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

    console.log('Update profile request:', { accId, personalData, bankDetails, sourceOfFunding });

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update personal data
      if (personalData) {
        const updateFields = {};
        
        // Handle each field with proper formatting
        if (personalData.P_Name !== undefined) updateFields.P_Name = personalData.P_Name;
        if (personalData.P_Address !== undefined) updateFields.P_Address = personalData.P_Address;
        if (personalData.P_Postal_Code !== undefined) updateFields.P_Postal_Code = personalData.P_Postal_Code;
        if (personalData.P_Cell_Number !== undefined) updateFields.P_Cell_Number = personalData.P_Cell_Number;
        if (personalData.Employment_Status !== undefined) updateFields.Employment_Status = personalData.Employment_Status;
        if (personalData.Purpose_of_Opening !== undefined) updateFields.Purpose_of_Opening = personalData.Purpose_of_Opening;
        
        // Format date properly
        if (personalData.Date_of_Birth !== undefined) {
          updateFields.Date_of_Birth = formatDateForMySQL(personalData.Date_of_Birth);
        }
        
        const fields = Object.keys(updateFields);
        if (fields.length > 0) {
          const setClause = fields.map(field => `${field} = ?`).join(', ');
          const values = fields.map(field => updateFields[field]);
          
          console.log('Updating personal data:', { setClause, values });
          
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
          const updateFields = {};
          
          if (bankDetails.Bank_Acc_Name !== undefined) updateFields.Bank_Acc_Name = bankDetails.Bank_Acc_Name;
          if (bankDetails.Bank_Name !== undefined) updateFields.Bank_Name = bankDetails.Bank_Name;
          if (bankDetails.Branch !== undefined) updateFields.Branch = bankDetails.Branch;
          
          // Format bank opening date properly
          if (bankDetails.Bank_Acc_Date_of_Opening !== undefined) {
            updateFields.Bank_Acc_Date_of_Opening = formatDateForMySQL(bankDetails.Bank_Acc_Date_of_Opening);
          }
          
          const fields = Object.keys(updateFields);
          if (fields.length > 0) {
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => updateFields[field]);
            
            console.log('Updating bank details:', { setClause, values });
            
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
          const updateFields = {};
          
          if (sourceOfFunding.Nature_of_Work !== undefined) updateFields.Nature_of_Work = sourceOfFunding.Nature_of_Work;
          if (sourceOfFunding['Business/School_Name'] !== undefined) updateFields['Business/School_Name'] = sourceOfFunding['Business/School_Name'];
          if (sourceOfFunding['Office/School_Address'] !== undefined) updateFields['Office/School_Address'] = sourceOfFunding['Office/School_Address'];
          if (sourceOfFunding['Office/School_Number'] !== undefined) updateFields['Office/School_Number'] = sourceOfFunding['Office/School_Number'];
          if (sourceOfFunding.Valid_ID !== undefined) updateFields.Valid_ID = sourceOfFunding.Valid_ID;
          if (sourceOfFunding.Source_of_Income !== undefined) updateFields.Source_of_Income = sourceOfFunding.Source_of_Income;
          
          const fields = Object.keys(updateFields);
          if (fields.length > 0) {
            const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');
            const values = fields.map(field => updateFields[field]);
            
            console.log('Updating funding source:', { setClause, values });
            
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

// Delete user account
router.delete('/profile/:accId', authenticateToken, async (req, res) => {
  try {
    const { accId } = req.params;

    console.log('Deleting account for user:', accId);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get user data to find related records
      const [personalRows] = await connection.execute(
        'SELECT Bank_Acc_No, Funding_ID FROM personal_data WHERE Acc_ID = ?',
        [accId]
      );

      if (personalRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ error: 'User not found' });
      }

      const personal = personalRows[0];

      // Delete contacts associated with this account
      await connection.execute(
        'DELETE FROM role_of_contact WHERE Acc_ID = ?',
        [accId]
      );

      // Get contact IDs that might need to be deleted if they're not referenced elsewhere
      const [contactIds] = await connection.execute(
        'SELECT DISTINCT Contact_ID FROM role_of_contact WHERE Acc_ID = ?',
        [accId]
      );

      // Delete contact person details for contacts that are only linked to this account
      for (const contact of contactIds) {
        const [otherReferences] = await connection.execute(
          'SELECT COUNT(*) as count FROM role_of_contact WHERE Contact_ID = ? AND Acc_ID != ?',
          [contact.Contact_ID, accId]
        );

        if (otherReferences[0].count === 0) {
          await connection.execute(
            'DELETE FROM contact_person_details WHERE Contact_ID = ?',
            [contact.Contact_ID]
          );
        }
      }

      // Delete personal data (this will cascade due to foreign key constraints)
      await connection.execute(
        'DELETE FROM personal_data WHERE Acc_ID = ?',
        [accId]
      );

      // Delete bank details if they exist
      if (personal.Bank_Acc_No) {
        await connection.execute(
          'DELETE FROM bank_details WHERE Bank_Acc_No = ?',
          [personal.Bank_Acc_No]
        );
      }

      // Delete funding source if it exists
      if (personal.Funding_ID) {
        await connection.execute(
          'DELETE FROM source_of_funding WHERE Funding_ID = ?',
          [personal.Funding_ID]
        );
      }

      // Delete credentials
      await connection.execute(
        'DELETE FROM credentials WHERE Acc_ID = ?',
        [accId]
      );

      await connection.commit();
      res.json({ message: 'Account deleted successfully' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account', message: error.message });
  }
});

module.exports = router;
