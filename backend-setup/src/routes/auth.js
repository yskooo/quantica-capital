
const express = require("express");
const router = express.Router();
const { registrationValidation, loginValidation, validateRequest } = require("../middleware/validation");
const { registerUser } = require("../controllers/registrationController");
const { loginUser } = require("../controllers/loginController");

// Registration route
router.post("/register", registrationValidation, validateRequest, registerUser);

// Login route
router.post("/login", loginValidation, validateRequest, loginUser);

module.exports = router;
