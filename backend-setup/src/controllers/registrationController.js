
const { pool, generateAccId, generateFundingId, generateBankAccNo } = require("../config/database");
const { generateUniqueContactId } = require("../utils/contactId");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  console.log("Register route hit!");
  console.log("Received Payload:", req.body);
  console.log("👉 contacts full structure:\n", JSON.stringify(req.body.contacts, null, 2));
  let connection;

  try {
    const { personalData, bankDetails, sourceOfFunding, contacts, credentials } = req.body;

    if (!contacts || contacts.length < 3) {
      return res.status(400).json({ error: "Minimum 3 contacts required for registration" });
    }

    const trimmedCellNumber = personalData?.P_Cell_Number
      ? String(personalData.P_Cell_Number).trim()
      : "";

    const trimmedEmail = credentials?.email?.trim() || "";
    const trimmedPersonalEmail = personalData?.P_Email?.trim() || trimmedEmail;

    console.log("Trimmed P_Email:", trimmedPersonalEmail);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if email already exists in personal_data
    const [existingUser] = await connection.execute(
      "SELECT Acc_ID FROM personal_data WHERE P_Email = ?",
      [trimmedPersonalEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check if phone number already exists in personal_data
    const [existingPhone] = await connection.execute(
      "SELECT Acc_ID FROM personal_data WHERE P_Cell_Number = ?",
      [trimmedCellNumber]
    );

    if (existingPhone.length > 0) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    const accId = await generateAccId();
    const fundingId = await generateFundingId();
    if (!fundingId) throw new Error("Failed to generate Funding_ID");
    const bankAccNo = generateBankAccNo();

    let hashedPassword = null;
    if (credentials.password) {
      hashedPassword = await bcrypt.hash(
        credentials.password,
        parseInt(process.env.BCRYPT_ROUNDS) || 10
      );
    }

    await connection.execute(
      `INSERT INTO source_of_funding (\`Funding_ID\`, \`Nature_of_Work\`, \`Business/School_Name\`, 
        \`Office/School_Address\`, \`Office/School_Number\`, \`Valid_ID\`, \`Source_of_Income\`) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        fundingId,
        sourceOfFunding?.Nature_of_Work || null,
        sourceOfFunding?.["Business/School_Name"] || null,
        sourceOfFunding?.["Office/School_Address"] || null,
        sourceOfFunding?.["Office/School_Number"] || null,
        sourceOfFunding?.Valid_ID || null,
        sourceOfFunding?.Source_of_Income || null,
      ]
    );

    const [fundingExists] = await connection.execute(
      "SELECT Funding_ID FROM source_of_funding WHERE Funding_ID = ?",
      [fundingId]
    );

    if (fundingExists.length === 0) {
      throw new Error("Funding_ID does not exist in source_of_funding.");
    }

    console.log("Generated Funding_ID:", fundingId);

    await connection.execute(
      `INSERT INTO bank_details (\`Bank_Acc_No\`, \`Bank_Acc_Name\`, \`Bank_Acc_Date_of_Opening\`, \`Bank_Name\`, \`Branch\`) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        bankAccNo, 
        bankDetails?.Bank_Acc_Name || null,
        bankDetails?.Bank_Acc_Date_of_Opening || null,
        bankDetails?.Bank_Name || null, 
        bankDetails?.Branch || null
      ]
    );

    const [bankExists] = await connection.execute(
      "SELECT Bank_Acc_No FROM bank_details WHERE Bank_Acc_No = ?",
      [bankAccNo]
    );

    if (bankExists.length === 0) {
      throw new Error("Bank_Acc_No does not exist in bank_details.");
    }

    console.log("Generated Bank_Acc_No:", bankAccNo);

    await connection.execute(
      `INSERT INTO personal_data (
        Acc_ID,
        P_Name,
        P_Address,
        P_Postal_Code,
        P_Cell_Number,
        P_Email,
        Date_of_Birth,
        Employment_Status,
        Purpose_of_Opening,
        P_Password,
        Funding_ID,
        Bank_Acc_No
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        accId,
        personalData.P_Name?.trim() || null,
        personalData.P_Address?.trim() || null,
        personalData.P_Postal_Code?.trim() || null,
        trimmedCellNumber,
        trimmedPersonalEmail,
        personalData.Date_of_Birth || null,
        personalData.Employment_Status || null,
        personalData.Purpose_of_Opening || null,
        hashedPassword,
        fundingId,
        bankAccNo,
      ]
    );

    console.log("Inserted into personal_data with P_Email:", trimmedPersonalEmail);

    // Insert contacts with unique and valid Contact_IDs (always 5 characters)
    for (const contact of contacts) {
      const { contactDetails } = contact;

      const contactId = await generateUniqueContactId(connection); // 5-char ID like "C0005"

      console.log("👉 Final Contact_ID value:", contactId, "| Length:", contactId.length);
      console.log("➡ Full contactDetails object:", contactDetails);
      console.log("➡ C_Contact_Number:", contactDetails?.C_Contact_Number);

      if (!contactDetails?.C_Contact_Number) {
        throw new Error("C_Contact_Number is required for every contact");
      }

      await connection.execute(
        `INSERT INTO contact_person_details (
          \`Contact_ID\`, 
          \`C_Name\`, 
          \`C_Address\`, 
          \`C_Postal_Code\`, 
          \`C_Email\`, 
          \`C_Contact_Number\`
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          contactId,
          contactDetails.C_Name?.trim() || null,
          contactDetails.C_Address?.trim() || null,
          contactDetails.C_Postal_Code?.trim() || null,
          contactDetails.C_Email?.trim() || null,
          contactDetails.C_Contact_Number?.trim() || null,
        ]
      );

      // Insert role of contact relationship
      await connection.execute(
        `INSERT INTO role_of_contact (
          \`Acc_ID\`,
          \`C_Role\`,
          \`Contact_ID\`,
          \`C_Relationship\`
        ) VALUES (?, ?, ?, ?)`,
        [
          accId,
          contact.role,
          contactId,
          contact.relationship || null,
        ]
      );
    }

    await connection.commit();

    const token = jwt.sign(
      { accId, email: trimmedPersonalEmail, phone: trimmedCellNumber },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.status(201).json({
      message: "Registration successful",
      data: {
        user: {
          accId,
          email: trimmedPersonalEmail,
          name: personalData.P_Name?.trim(),
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
        console.error("Rollback error:", rollbackErr);
      }
    }
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  registerUser
};
