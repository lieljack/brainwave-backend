const express = require("express")
const classlevelController = require("../controllers/ClassLevelController")
const { check } = require("express-validator")
const checkAuth = require('../middleware/check-auth')
const checkAdmin = require('../middleware/auth/check-admin')

const router = express.Router()

router.use(checkAuth)
router.get("/", classlevelController.getAllClassLevels)
router.get('/:classId', classlevelController.getClassLevelById)


// checks for admin previlages
router.use(checkAdmin)
router.post(
  "/",
  [check("classlevel").not().isEmpty()],
  classlevelController.createClassLevel
)

module.exports = router