const HttpError = require("../models/util/HttpErrorModel")
const QuestionModel = require("../models/QuestionModel")
const OptionsModel = require("../models/OptionsModel")
const SubjectModel = require("../models/SubjectModel")
const ClassLevelModel = require("../models/ClassLevelModel")
const { validationResult } = require("express-validator")
const Mongoose = require("mongoose")

const createQuestion = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Validation Error! Please fill the required fields and try again",
        422
      )
    )
  }

  // destructure data from request body
  const { question, subject, classlevel, options } = req.body

  // check if subject and classlevel exists
  let subjectExist
  let classLevelCheck
  try {
    subjectExist = await SubjectModel.findById(subject)
    classLevelCheck = await ClassLevelModel.findById(classlevel)
  } catch (err) {
    const error = new HttpError("Error finding subject and class level", 500)
    return next(error)
  }

  if (!subjectExist && !classLevelCheck) {
    const error = new HttpError("Class level or subject does not exist", 404)
    return next(error)
  }

  // @-- Create options subdocument --@ //
  let published
  let optionArray = []
  if (options.length > 0) {
    
    // Check if correct answer is provided
    const check = options.findIndex(element => {return element.isCorrect === true})
    console.log(check);
    if(check) {
      published = true
    } else {
      published = false
    }

    options.forEach((element) => {
      optionArray.push({
        text: element.option,
        correct: element.isCorrect
      })
    })
  } else {
    const error = new HttpError("No options provided", 422)
    return next(error)
  }


  // Create new question
  const newQuestion = new QuestionModel({
    subject,
    class_level: classlevel,
    question,
    options: optionArray,
    published,
  })

  try {
    await newQuestion.save()
  } catch (err) {
    const error = new HttpError("Error saving question", 500)
  }
  res.json({ message: newQuestion })
}


const getQuestions = async (req, res, next) => {
  let questions
  try {
    questions = await QuestionModel.find({}).populate('subject').populate('class_level')
  } catch (err) {
    const error = HttpError("Internal Server Error", 500)
    return next(error)
  }

  res.json(questions)
}

exports.createQuestion = createQuestion
exports.getQuestions = getQuestions