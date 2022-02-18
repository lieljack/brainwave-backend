const SubjectModel = require('../models/SubjectModel')
const HttpError = require("../models/util/HttpErrorModel")
const { validationResult } = require("express-validator")


const createSubject = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(new HttpError("Validation Error! Please fill the required fields and try again", 422))
  }

  const { subject } = req.body
  
  let existingSubject
  try {
    existingSubject = await SubjectModel.findOne({ name: subject })
  } catch(err) {
    const error = new HttpError('Server error', 500)
    return next(error)
  }
  
  if(existingSubject) {
    const error = new HttpError('Subject exists', 422)
    return next(error)
  }

  const newSubject = new SubjectModel({
    name: subject
  })
  
  let result
  try {
    result = await newSubject.save()
  } catch(err) {
    const error = new HttpError('Could not save! Server error', 500)
    return next(error)
  }
  
  res.json(result)
}


const getAllSubjects = async (req, res, next) => {
  let subjects
  try {
    subjects = await SubjectModel.find()
  } catch (err) {
    const error = new HttpError('Server error', 500)
    return next(error)
  }
  
  res.json(subjects)
}

exports.createSubject = createSubject
exports.getAllSubjects = getAllSubjects 