const express = require("express")
const {signup,login} = require("../controllers/authControllers")
const {handleValidationErrors} = require("../validators/handleValidationErrors")
const {signupValidation,loginValidation} = require("../validators/validate")
const router = express.Router()

router.post("/signup", signupValidation,handleValidationErrors,signup)
router.post("/login", loginValidation,handleValidationErrors,login)

module.exports = router