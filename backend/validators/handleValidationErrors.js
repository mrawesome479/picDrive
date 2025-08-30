const { validationResult, body } = require("express-validator");


exports.handleValidationErrors = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ error: error.array() });
  }
  next();
};


