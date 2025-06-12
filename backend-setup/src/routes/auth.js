const express = require('express');
const router = express.Router();
const {
  pool,
  generateAccId,
  generateFundingId,
  generateBankAccNo
} = require('../config/database');  // destructure from your database module
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

router.post(
  '/register',
  // Input validations (adjust as needed)
  body('personalData.P_Cell_Number').notEmpty().withMessage('Cell number is required'),
  body('credentials.email').isEmail().withMessage('Valid email required'),
  body('credentials.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  async (req, res) => {
    let connection;

    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { personalData, bankDetails, sourceOfFunding, contacts, credentials } = req.body;

      if (!contacts || contacts.length < 3) {
        return res.status(400).json({ error: 'Minimum 3 contacts required for registration' });
      }

      // Safely trim personalData fields
      const cellNumberRaw = personalData?.P_Cell_Number;
      const trimmedCellNumber = typeof cellNumberRaw === 'string' ? cellNumberRaw.trim() : '';

      const emailRaw = credentials?.email;
      const trimmedEmail = typeof emailRaw === 'string' ? emailRaw.trim() : '';

      const nameRaw = personalData?.P_Name;
      const trimmedName = typeof nameRaw === 'string' ? nameRaw.trim() : null;

      const personalEmailRaw = personalData?.P_Email;
      const trimmedPersonalEmail = typeof personalEmailRaw === 'string' ? personalEmailRaw.trim() : null;

      // Get connection from pool
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Check duplicate phone number
      const [existingPhone] = await connection.execute(
        'SELECT P_Cell_Number FROM personal_data WHERE P_Cell_Number = ?',
        [trimmedCellNumber]
      );
      if (existingPhone.length > 0) {
        await connection.rollback();
        return res.status(409).json({ error: 'Phone number already registered' });
      }

      // Check duplicate email if provided
      if (trimmedEmail) {
        const [existingEmail] = await connection.execute(
          'SELECT P_Email FROM personal_data WHERE P_Email = ?',
          [trimmedEmail]
        );
        if (existingEmail.length > 0) {
          await connection.rollback();
          return res.status(409).json({ error: 'Email already registered' });
        }
      }

      // Generate IDs
      const accId = await generateAccId();
      const fundingId = await generateFundingId();
      if (!fundingId) throw new Error('Failed to generate Funding_ID');
      const bankAccNo = generateBankAccNo();

      // Hash password
      let hashedPassword = null;
      if (credentials.password) {
        hashedPassword = await bcrypt.hash(credentials.password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
      }

      // Insert source_of_funding
      await connection.execute(
        `INSERT INTO source_of_funding (Funding_ID, Nature_of_Work, \`Business/School_Name\`, 
          \`Office/School_Address\`, \`Office/School_Number\`, Valid_ID, Source_of_Income) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          fundingId,
          sourceOfFunding?.Nature_of_Work || null,
          sourceOfFunding?.['Business/School_Name'] || null,
          sourceOfFunding?.['Office/School_Address'] || null,
          sourceOfFunding?.['Office/School_Number'] || null,
          sourceOfFunding?.Valid_ID || null,
          sourceOfFunding?.Source_of_Income || null,
        ]
      );

      // Insert bank details
      await connection.execute(
        `INSERT INTO bank_details (Account_ID, Bank_Acc_No, Bank_Name, Branch) VALUES (?, ?, ?, ?)`,
        [accId, bankAccNo, bankDetails?.Bank_Name || null, bankDetails?.Bank_Address || null]
      );

      await connection.execute(
        `INSERT INTO personal_data (Acc_ID, P_Name, P_Cell_Number, P_Email, P_Password, Funding_ID, Bank_Acc_No)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          accId,
          trimmedName,
          trimmedCellNumber,
          trimmedPersonalEmail,
          hashedPassword,
          fundingId,
          bankAccNo
        ]
      );

      // Insert contacts
      for (const contact of contacts) {
        console.log('Contact object:', contact);

        // Access nested contact number correctly if contactDetails exists
        const rawNumber = contact.contactDetails?.C_Contact_Number || contact.C_Contact_Number;
        console.log('Raw Contact Number:', rawNumber);

        const trimmedNumber = typeof rawNumber === 'string' ? rawNumber.trim() : '';

        if (!trimmedNumber) {
          throw new Error('Contact number is required for each contact');
        }

        // Use the trimmed number and other trimmed fields here for insertion
        // Make sure to trim other contact fields as well before insertion
        const trimmedContactName = typeof contact.C_Name === 'string' ? contact.C_Name.trim() : null;
        const trimmedContactAddress = typeof contact.C_Address === 'string' ? contact.C_Address.trim() : null;
        const trimmedContactPostal = typeof contact.C_Postal_Code === 'string' ? contact.C_Postal_Code.trim() : null;
        const trimmedContactEmail = typeof contact.C_Email === 'string' ? contact.C_Email.trim() : null;

        const contactId = 'C' + Math.floor(10000 + Math.random() * 90000).toString().slice(1);

        await connection.execute(
          `INSERT INTO contact_person_details 
            (Contact_ID, C_Name, C_Address, C_Postal_Code, C_Email, C_Contact_Number) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            contactId,
            trimmedContactName,
            trimmedContactAddress,
            trimmedContactPostal,
            trimmedContactEmail,
            trimmedNumber,
          ]
        );
      }


      await connection.commit();

      // Issue JWT token
      const token = jwt.sign(
        { accId, email: trimmedEmail, phone: trimmedCellNumber },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        message: 'Registration successful',
        data: {
          user: {
            accId,
            email: trimmedEmail,
            name: trimmedName,
            phone: trimmedCellNumber,
          },
          token,
        },
      });

    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackErr) {
          console.error('Rollback error:', rollbackErr);
        }
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed', message: error.message });
    } finally {
      if (connection) connection.release();
    }
  }
);

module.exports = router;