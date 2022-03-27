const HttpError = require("../models/util/HttpErrorModel")
const QuestionModel = require("../models/QuestionModel")
const SubjectModel = require("../models/SubjectModel")
const ClassLevelModel = require("../models/ClassLevelModel")
const TopicModel = require("../models/TopicModel")
const { validationResult } = require("express-validator")
const mongoose = require("mongoose")

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

  console.log(topic)
  let newQuestion

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

  try {
    const session = await mongoose.startSession()
    session.startTransaction()

    // @ -- Get or create Topic
    let topicObject
    topicObject = await TopicModel.findOne({
      topic: topic,
      subject: subjectExist._id,
    })

    if (!topicObject) {
      topicObject = new TopicModel({ subject: subjectExist._id, topic: topic })
      topicObject.save({ session })
    }

    console.log(topicObject)

    // @-- Create options subdocument --@ //
    let published
    let optionArray = []
    if (options.length > 0) {
      // Check if correct answer is provided
      const check = options.findIndex((element) => {
        return element.isCorrect === true
      })

      if (check > -1) {
        published = true
      } else {
        published = false
      }

      options.forEach((element) => {
        optionArray.push({
          text: element.option,
          correct: element.isCorrect,
        })
      })
    } else {
      const error = new HttpError("No options provided", 422)
      return next(error)
    }

    // Create new question
    newQuestion = new QuestionModel({
      subject,
      class_level: classlevel,
      topic: topicObject._id,
      question,
      options: optionArray,
      published,
    })

    newQuestion.save({ session })

    await session.commitTransaction()
    session.endSession()
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }
  res.json({ message: newQuestion })
}

const getQuestions = async (req, res, next) => {
  let questions
  try {
    questions = await QuestionModel.find({})
      .populate("subject")
      .populate("class_level")
      .populate("topic")
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
  const { question, subject, classlevel, options, topic } = req.body

  const { id } = req.params

  let questionObject
  try {
    questionObject = await QuestionModel.findById(id)
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  if (!questionObject) {
    const error = new HttpError("Question does not exist", 404)
    return next(error)
  }

  try {
    const session = await mongoose.startSession()
    session.startTransaction()

    // @ - check if classlevel changed
    // @ - if changed, get new class level object and replace
    if (questionObject.class_level !== classlevel) {
      let newClassLevel
      try {
        newClassLevel = await ClassLevelModel.findById(classlevel)
      } catch (err) {
        const error = new HttpError("Internal Server Error", 500)
        return next(error)
      }

      if (!newClassLevel) {
        const error = new HttpError("Class level does not exist", 404)
        return next(error)
      }

      await QuestionModel.findByIdAndUpdate(
        id,
        { class_level: newClassLevel },
        { session }
      )
    }

    // @ - check if subject change and update
    if (questionObject.subject != subject) {
      let newSubject
      try {
        newSubject = await SubjectModel.findById(subject)
      } catch (err) {
        const error = new HttpError("Internal Server Error", 500)
        return next(error)
      }

      if (!newSubject) {
        const error = new HttpError("Subject does not exist", 404)
        return next(error)
      }

      await QuestionModel.findByIdAndUpdate(
        id,
        { subject: newSubject },
        { session }
      )
    }

    // @ - update question and options
    // @-- Create options subdocument --@ //
    let published
    let optionArray = []
    if (options.length > 0) {
      // Check if correct answer is provided
      const check = options.findIndex((element) => {
        return element.isCorrect === true
      })

      if (check > -1) {
        published = true
      } else {
        published = false
      }

      options.forEach((element) => {
        optionArray.push({
          text: element.option,
          correct: element.isCorrect,
        })
      })

      try {
        await QuestionModel.findByIdAndUpdate(
          id,
          {
            question,
            options: optionArray,
            published,
          },
          { session }
        )
      } catch (err) {
        const error = new HttpError("Internal Server Error!", 500)
        return next(error)
      }
    } else {
      const error = new HttpError("No options provided", 422)
      return next(error)
    }

    // @ -- Update Topic
    // @ -- Get or create Topic
    let topicObject
    topicObject = await TopicModel.findOne({
      topic: topic,
      subject: subject,
    })

    if (!topicObject) {
      topicObject = new TopicModel({ subject: subject, topic: topic })
      topicObject.save({ session })
    }

    await QuestionModel.findByIdAndUpdate(
      id,
      { topic: topicObject._id },
      { session }
    )

    await session.commitTransaction()

    questionObject = await QuestionModel.findById(id)
  } catch (err) {
    console.log(err)
    const error = new HttpError("Internal server error", 500)
    return next(error)
  }

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

  res.json({ message: "Success" })
}

const getTopicSuggestions = async (req, res, next) => {
  const { subjectId } = req.params

  let suggestions
  try {
    suggestions = await TopicModel.find({ subject: subjectId })
  } catch (err) {
    const error = new HttpError("internal server error", 500)
    return next(error)
  }

  res.json(suggestions)
}

const getStats = async (req, res, next) => {
  let questionCount, classlevelCount, subjectCount
  try {
    questionCount = await QuestionModel.count({})
    classlevelCount = await ClassLevelModel.count({})
    subjectCount = await SubjectModel.count({})
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  res.json({
    questions: questionCount,
    classlevel: classlevelCount,
    subject: subjectCount,
  })
}

const getNumberofQuestionsByTopicId = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        error,
        422
      )
    )
  }

  // destructure data from request body
  const { topic_ids, subject_ids, difficulty_level } = req.body

  let questionCount

  try {
    questionCount = await QuestionModel.find({
      subject: { $in: subject_ids },
      class_level: difficulty_level,
      topic: { $in: topic_ids },
    }).count()
  } catch (err) {
    const error = new HttpError("Internal Server Error", 500)
    return next(error)
  }

  res.json({ count: questionCount })
}

exports.createQuestion = createQuestion
exports.getQuestions = getQuestions
exports.editQuestion = editQuestion
exports.deleteQuestion = deleteQuestion
exports.getTopicSuggestions = getTopicSuggestions
exports.getStats = getStats
exports.getNumberofQuestionsByTopicId = getNumberofQuestionsByTopicId
