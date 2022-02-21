const HttpError = require("../models/util/HttpErrorModel")
const QuestionModel = require("../models/QuestionModel")
const SubjectModel = require("../models/SubjectModel")
const ClassLevelModel = require("../models/ClassLevelModel")
const { validationResult } = require("express-validator")

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
  const { question, subject, classlevel, options, topic } = req.body

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
    topic,
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


const editQuestion = async (req, res, next) => {
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

  const { id } = req.params

  let questionObject
  try {
    questionObject = await QuestionModel.findById(id)
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  if(!questionObject) {
    const error = new HttpError("Question does not exist", 404)
    return next(error)
  }

  // @ - check if classlevel changed
  // @ - if changed, get new class level object and replace
  if(questionObject.class_level !== classlevel) {
    let newClassLevel
    try {
      newClassLevel = await ClassLevelModel.findById(classlevel)
    } catch(err) {
      const error = new HttpError("Internal Server Error", 500)
      return next(error)
    }

    if(!newClassLevel) {
      const error = new HttpError("Class level does not exist", 404)
      return next(error)
    }

    await QuestionModel.findByIdAndUpdate(id, {class_level: newClassLevel})
  }

  // @ - check if subject change and update
  if(questionObject.subject != subject) {
    let newSubject
    try {
      newSubject = await SubjectModel.findById(subject)
    } catch(err) {
      const error = new HttpError("Internal Server Error", 500)
      return next(error)
    }

    if(!newSubject) {
      const error = new HttpError("Subject does not exist", 404)
      return next(error)
    }

    await QuestionModel.findByIdAndUpdate(id, {subject: newSubject})
  }

  // @ - check if question is changed
  try {
    await QuestionModel.findByIdAndUpdate(id, {
      question,
      topic
    })
  } catch (err) {
    const error = new HttpError("Internal Server Error!", 500)
    return next(error)
  }


  let optionArray = []
  options.forEach((element) => {
    optionArray.push({
      text: element.option,   
      correct: element.isCorrect
    })
  })

  try {
    await QuestionModel.findByIdAndUpdate(id, {options: optionArray})
  } catch (err) {
    const error = new HttpError("Internal Server Error!", 500)
    return next(error)
  }

  questionObject = await QuestionModel.findById(id)

  res.json(questionObject)
}

const deleteQuestion = async (req, res, next) => {
  const { id } = req.params
  let deletedQuestion 
  try {
    deletedQuestion = await QuestionModel.findByIdAndDelete(id)
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  console.log(deleteQuestion.toString())

  res.json({message: "Success"})
}

exports.createQuestion = createQuestion
exports.getQuestions = getQuestions
exports.editQuestion = editQuestion
exports.deleteQuestion = deleteQuestion