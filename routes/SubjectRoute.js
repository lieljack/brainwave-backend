const express = require("express")
const subjectController = require("../controllers/SubjectController")
const { check } = require("express-validator")
const checkAuth = require("../middleware/check-auth")
const checkAdmin = require("../middleware/auth/check-admin")

const router = express.Router()

router.use(checkAuth)

router.get("/", subjectController.getAllSubjects)
router.get("/:classlevel", subjectController.getSubjectsForClassLevel)

router.use(checkAdmin)

router.post(
  "/",
  [check("subject").not().isEmpty()],
  subjectController.createSubject
)

module.exports = router
