const SubjectModel = require('../models/SubjectModel')
const HttpError = require("../models/util/HttpErrorModel")
const { validationResult } = require("express-validator")


const createSubject = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(new HttpError("Validation Error! Please fill the required fields and try again", 422))
  }

  // @ - Todo Check token
  // @ - Todo Check if is admin

  const 
}