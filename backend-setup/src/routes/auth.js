const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool, generateAccId, generateContactId, generateFundingId, generateBankAccNo } = require('../config/database');

const router = express.Router();

// Registration endpoint
router.post('/register', [
  body('credentials.email').isEmail().normalizeEmail(),
  body('credentials.password').isLength({ min: 8 }),
  body('personalData.P_Name').notEmpty(),
  body('personalData.P_Cell_Number').isNumeric().isLength({ min: 10, max: 15 }),
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { personalData, bankDetails, sourceOfFunding, contacts, credentials } = req.body;

    console.log('Registration request received:', {
      email: credentials.email,
      phone: personalData.P_Cell_Number,
      name: personalData.P_Name
    });

    // Check if email already exists
    const [existingUser] = await pool.execute(
      'SELECT P_Email FROM personal_data WHERE P_Email = ?',
      [credentials.email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Generate IDs
      const accId = await generateAccId();
      const fundingId = await generateFundingId();
      const bankAccNo = generateBankAccNo();

      // Hash password
      const hashedPassword = await bcrypt.hash(credentials.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

      // Insert source of funding
      await connection.execute(
        `INSERT INTO source_of_funding (Funding_ID, Nature_of_Work, \`Business/School_Name\`, 
         \`Office/School_Address\`, \`Office/School_Number\`, Valid_ID, Source_of_Income) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          fundingId,
          sourceOfFunding.Nature_of_Work,
          sourceOfFunding['Business/School_Name'],
          sourceOfFunding['Office/School_Address'],
          sourceOfFunding['Office/School_Number'],
          sourceOfFunding.Valid_ID,
          sourceOfFunding.Source_of_Income
        ]
      );

      // Insert bank details
      await connection.execute(
        `INSERT INTO bank_details (Bank_Acc_No, Bank_Acc_Name, Bank_Acc_Date_of_Opening, Bank_Name, Branch) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          bankAccNo,
          bankDetails.Bank_Acc_Name,
          bankDetails.Bank_Acc_Date_of_Opening,
          bankDetails.Bank_Name,
          bankDetails.Branch
        ]
      );

      // Insert personal data
      await connection.execute(
        `INSERT INTO personal_data (Acc_ID, P_Name, P_Address, P_Postal_Code, P_Cell_Number, P_Email, 
         Date_of_Birth, Employment_Status, Purpose_of_Opening, Funding_ID, Bank_Acc_No) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accId,
          personalData.P_Name,
          personalData.P_Address,
          personalData.P_Postal_Code,
          personalData.P_Cell_Number,
          credentials.email,
          personalData.Date_of_Birth,
          personalData.Employment_Status,
          personalData.Purpose_of_Opening,
          fundingId,
          bankAccNo
        ]
      );

      // Insert contacts
      for (const contact of contacts) {
        const contactId = await generateContactId();
        
        // Insert contact details
        await connection.execute(
          `INSERT INTO contact_person_details (Contact_ID, C_Name, C_Address, C_Postal_Code, C_Email, C_Contact_Number) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            contactId,
            contact.contactDetails.C_Name,
            contact.contactDetails.C_Address,
            contact.contactDetails.C_Postal_Code,
            contact.contactDetails.C_Email,
            contact.contactDetails.C_Contact_Number
          ]
        );

        // Insert role of contact
        await connection.execute(
          `INSERT INTO role_of_contact (Acc_ID, C_Role, Contact_ID, C_Relationship) 
           VALUES (?, ?, ?, ?)`,
          [accId, contact.role, contactId, contact.relationship]
        );
      }

      // Store password hash (you might want a separate users table for authentication)
      // For now, we'll create a simple auth table
      await connection.execute(
        `CREATE TABLE IF NOT EXISTS user_auth (
          id INT AUTO_INCREMENT PRIMARY KEY,
          acc_id CHAR(4) UNIQUE,
          email VARCHAR(60) UNIQUE,
          password_hash VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );

      await connection.execute(
        'INSERT INTO user_auth (acc_id, email, password_hash) VALUES (?, ?, ?)',
        [accId, credentials.email, hashedPassword]
      );

      await connection.commit();

      // Generate JWT token
      const token = jwt.sign(
        { accId, email: credentials.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'Registration successful',
        data: {
          user: { accId, email: credentials.email, name: personalData.P_Name },
          token
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Get user authentication data
    const [authRows] = await pool.execute(
      'SELECT acc_id, email, password_hash FROM user_auth WHERE email = ?',
      [email]
    );

    if (authRows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = authRows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile data
    const [profileRows] = await pool.execute(
      'SELECT * FROM personal_data WHERE Acc_ID = ?',
      [user.acc_id]
    );

    if (profileRows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const profile = profileRows[0];

    // Generate JWT token
    const token = jwt.sign(
      { accId: user.acc_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      data: {
        user: {
          accId: profile.Acc_ID,
          email: profile.P_Email,
          name: profile.P_Name,
          phone: profile.P_Cell_Number,
          address: profile.P_Address
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
