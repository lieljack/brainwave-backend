const SubjectModel = require("../models/SubjectModel")
const ClasslevelModel = require("../models/ClassLevelModel")
const QuestionModel = require("../models/QuestionModel")
const HttpError = require("../models/util/HttpErrorModel")
const { validationResult } = require("express-validator")
const TopicModel = require("../models/TopicModel")

const createSubject = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Validation Error! Please fill the required fields and try again",
        422
      )
    )
  }

  const { subject } = req.body

  let existingSubject
  try {
    existingSubject = await SubjectModel.findOne({ name: subject })
  } catch (err) {
    const error = new HttpError("Server error", 500)
    return next(error)
  }

  if (existingSubject) {
    const error = new HttpError("Subject exists", 422)
    return next(error)
  }

  const newSubject = new SubjectModel({
    name: subject,
  })

  let result
  try {
    result = await newSubject.save()
  } catch (err) {
    const error = new HttpError("Could not save! Server error", 500)
    return next(error)
  }

  res.json(result)
}

const getAllSubjects = async (req, res, next) => {
  let subjects
  try {
    subjects = await SubjectModel.find()
  } catch (err) {
    const error = new HttpError("Server error", 500)
    return next(error)
  }

  res.json(subjects)
}

const getSubjectsForClassLevel = async (req, res, next) => {
  const { classlevel } = req.params

  let classlevelObject
  try {
    classlevelObject = await ClasslevelModel.findById(classlevel)
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  if (!classlevelObject) {
    const error = new HttpError("Class level does not exist", 404)
    return next(error)
  }

  // Selects distinct subjects
  let subjects
  try {
    subjects = await QuestionModel.find({
      class_level: classlevelObject._id,
    }).distinct("subject")
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  const arry = []

  for (let index = 0; index < subjects.length; index++) {
    const element = subjects[index]
    const sub = await SubjectModel.findById(element)
    const topics = await QuestionModel.distinct("topic", {
      class_level: classlevelObject._id,
      subject: element,
    })

    
    let objArray = []
    for (let j = 0; j < topics.length; j++) {
      const topic = topics[j]
      
      // count questions
      const questionCount = await QuestionModel.find({
        class_level: classlevelObject._id,
        subject: element,
        topic
      }).count()

      const obj = await TopicModel.findById(topic)
      const newObj = obj.toObject()
      newObj["checked"] = true
      newObj["number_of_questions"] = questionCount
      objArray.push(newObj)
    }

    const newSub = sub.toObject()
    newSub["topics"] = objArray
    arry.push(newSub)
  }

  console.log(arry)

  res.json(arry)
}

exports.createSubject = createSubject
exports.getAllSubjects = getAllSubjects
exports.getSubjectsForClassLevel = getSubjectsForClassLevel
