const express = require("express")
const CBTModel = require('../models/TestModel')
const checkAuth = require('../middleware/check-auth')
const CBTController = require('../controllers/TestController')

const router = express.Router()


router.use(checkAuth)

router.post('/create-test', CBTController.createTest)

module.exports = router