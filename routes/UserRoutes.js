const express = require("express")
const userController = require("../controllers/UserController")
const { check } = require("express-validator")

const router = express.Router()

router.post(
  "/signup",
  [
    check("first_name").not().isEmpty(),
    check("last_name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
)

router.post('/login', userController.login)

module.exports = router
