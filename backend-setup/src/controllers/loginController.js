
const { pool } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  console.log("Login route hit!");
  let connection;

  try {
    const { email, password } = req.body;

    connection = await pool.getConnection();

    // Find user by email in personal_data table
    const [users] = await connection.execute(
      "SELECT * FROM personal_data WHERE P_Email = ?",
      [email.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.P_Password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        accId: user.Acc_ID, 
        email: user.P_Email, 
        phone: user.P_Cell_Number 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.json({
      message: "Login successful",
      data: {
        user: {
          accId: user.Acc_ID,
          email: user.P_Email,
          name: user.P_Name,
          phone: user.P_Cell_Number,
          address: user.P_Address,
          postalCode: user.P_Postal_Code,
          dateOfBirth: user.Date_of_Birth,
          employmentStatus: user.Employment_Status,
          purposeOfOpening: user.Purpose_of_Opening
        },
        token,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  loginUser
};
