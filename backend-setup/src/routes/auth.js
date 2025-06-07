
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool, generateAccId, generateContactId, generateFundingId, generateBankAccNo } = require('../config/database');

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

// Registration endpoint - require minimum 3 contacts
router.post('/register', [
  // Basic validation - make sure required fields exist
  body('credentials.password').optional().isLength({ min: 4 }),
  body('personalData.P_Name').notEmpty().withMessage('Name is required'),
  body('personalData.P_Cell_Number').notEmpty().withMessage('Phone number is required'),
  body('contacts').isArray({ min: 3 }).withMessage('Minimum 3 contacts required'),
], async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { personalData, bankDetails, sourceOfFunding, contacts, credentials } = req.body;

    // Validate minimum 3 contacts
    if (!contacts || contacts.length < 3) {
      return res.status(400).json({ error: 'Minimum 3 contacts required for registration' });
    }

    console.log('Registration request received:', {
      email: credentials?.email || 'No email provided',
      phone: personalData.P_Cell_Number,
      name: personalData.P_Name,
      contactsCount: contacts.length
    });

    // Check if phone number already exists
    const [existingPhone] = await pool.execute(
      'SELECT P_Cell_Number FROM personal_data WHERE P_Cell_Number = ?',
      [personalData.P_Cell_Number]
    );

    if (existingPhone.length > 0) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Check email if provided
    if (credentials?.email) {
      const [existingUser] = await pool.execute(
        'SELECT P_Email FROM personal_data WHERE P_Email = ?',
        [credentials.email]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Generate IDs
      const accId = await generateAccId();
      const fundingId = await generateFundingId();
      const bankAccNo = generateBankAccNo();

      // Hash password if provided
      let hashedPassword = null;
      if (credentials?.password) {
        hashedPassword = await bcrypt.hash(credentials.password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
      }

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

      // Format dates for MySQL
      const bankOpeningDate = formatDateForMySQL(bankDetails.Bank_Acc_Date_of_Opening);
      const dateOfBirth = formatDateForMySQL(personalData.Date_of_Birth);

      console.log('Formatted dates:', { bankOpeningDate, dateOfBirth });

      // Insert bank details
      await connection.execute(
        `INSERT INTO bank_details (Bank_Acc_No, Bank_Acc_Name, Bank_Acc_Date_of_Opening, Bank_Name, Branch) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          bankAccNo,
          bankDetails.Bank_Acc_Name,
          bankOpeningDate,
          bankDetails.Bank_Name,
          bankDetails.Branch
        ]
      );

      // Insert personal data with password
      await connection.execute(
        `INSERT INTO personal_data (Acc_ID, P_Name, P_Address, P_Postal_Code, P_Cell_Number, P_Email, P_Password,
         Date_of_Birth, Employment_Status, Purpose_of_Opening, Funding_ID, Bank_Acc_No) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accId,
          personalData.P_Name,
          personalData.P_Address,
          personalData.P_Postal_Code,
          personalData.P_Cell_Number,
          credentials?.email || null,
          hashedPassword,
          dateOfBirth,
          personalData.Employment_Status || 'Student',
          personalData.Purpose_of_Opening || 'Personal Use',
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
            contact.contactDetails.C_Email || null,
            contact.contactDetails.C_Contact_Number
          ]
        );

        // Insert role of contact
        await connection.execute(
          `INSERT INTO role_of_contact (Acc_ID, C_Role, Contact_ID, C_Relationship) 
           VALUES (?, ?, ?, ?)`,
          [accId, contact.role, contactId, contact.relationship || 'Friend']
        );
      }

      await connection.commit();

      // Generate JWT token
      const token = jwt.sign(
        { accId, email: credentials?.email, phone: personalData.P_Cell_Number },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        message: 'Registration successful',
        data: {
          user: { accId, email: credentials?.email, name: personalData.P_Name, phone: personalData.P_Cell_Number },
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

// Login endpoint - support both email and phone login
router.post('/login', [
  // Either email or phone is required, but not both necessarily
  body().custom((body) => {
    if (!body.email && !body.phone) {
      throw new Error('Either email or phone number is required');
    }
    return true;
  }),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password } = req.body;
    let user;

    // Try to find user by email first if provided
    if (email) {
      const [rows] = await pool.execute(
        'SELECT * FROM personal_data WHERE P_Email = ?',
        [email]
      );
      
      if (rows.length > 0) {
        user = rows[0];
      }
    }

    // If no user found by email and phone provided, try to find by phone
    if (!user && phone) {
      const [rows] = await pool.execute(
        'SELECT * FROM personal_data WHERE P_Cell_Number = ?',
        [phone]
      );
      
      if (rows.length > 0) {
        user = rows[0];
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    if (!user.P_Password) {
      return res.status(401).json({ error: 'No password set for this account' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.P_Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { accId: user.Acc_ID, email: user.P_Email, phone: user.P_Cell_Number },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Login successful',
      data: {
        user: {
          accId: user.Acc_ID,
          email: user.P_Email || null,
          name: user.P_Name,
          phone: user.P_Cell_Number,
          address: user.P_Address || null
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Logout endpoint (simple)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Simple check if email exists (for validation)
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT P_Email FROM personal_data WHERE P_Email = ?', 
      [email]
    );
    
    res.json({
      available: rows.length === 0
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ error: 'Failed to check email' });
  }
});

module.exports = router;
