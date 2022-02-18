const express = require("express")
const questionController = require("../controllers/QuestionController")
const checkAuth = require("../middleware/check-auth")
const checkAdmin = require("../middleware/auth/check-admin")
const { check } = require("express-validator")

const router = express.Router()

router.use(checkAuth)
router.use(checkAdmin)

router.post(
  "/",
  [
    check("question").isString().not().isEmpty(),
    check("subject").isString().not().isEmpty(),
    check("classlevel").isString().not().isEmpty(),
    check("options").isArray({ min: 1 }),
  ],
  questionController.createQuestion
)

router.get("/", questionController.getQuestions)

module.exports = router
