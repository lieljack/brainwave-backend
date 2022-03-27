const express = require("express")
const questionController = require("../controllers/QuestionController")
const checkAuth = require("../middleware/check-auth")
const checkAdmin = require("../middleware/auth/check-admin")
const { check } = require("express-validator")

const router = express.Router()

router.use(checkAuth)
router.post(
  "/get_number_of_questions",
  [
    check("topic_ids").isArray().not().isEmpty(),
    check("subject_ids").isArray().not().isEmpty(),
    check("difficulty_level").isString().not().isEmpty(),
  ],
  questionController.getNumberofQuestionsByTopicId
)



router.use(checkAdmin)

router.get("/", questionController.getQuestions)

router.post(
  "/",
  [
    check("question").isString().not().isEmpty(),
    check("subject").isString().not().isEmpty(),
    check("classlevel").isString().not().isEmpty(),
    check("topic").isString().not().isEmpty(),
    check("options").isArray({ min: 1 }),
  ],
  questionController.createQuestion
)

router.patch("/:id", questionController.editQuestion)

router.delete("/:id", questionController.deleteQuestion)

router.get("/topic_suggestions/:subjectId", questionController.getTopicSuggestions)

router.get("/stats", questionController.getStats)


module.exports = router
