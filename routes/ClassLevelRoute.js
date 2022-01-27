const express = require("express")
const classlevelController = require("../controllers/ClassLevelController")
const { check } = require("express-validator")

const router = express.Router()

router.post(
  "/create",
  [check("classlevel").not().isEmpty()],
  classlevelController.createClassLevel
)
