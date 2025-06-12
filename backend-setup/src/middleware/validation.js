
const { body, validationResult } = require("express-validator");

const registrationValidation = [
  body("personalData.P_Cell_Number")
    .notEmpty()
    .withMessage("Cell number is required"),
  body("credentials.email").isEmail().withMessage("Valid email required"),
  body("credentials.password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registrationValidation,
  loginValidation,
  validateRequest
};
