const HttpError = require("../models/util/HttpErrorModel")
const { validationResult } = require("express-validator")
const QuestionModel = require("../models/QuestionModel")
const CBTModel = require("../models/TestModel")



const createTest = async (req, res, next) => {
    const user = req.userData
    const { class_level, duration, topics, subjects } = req.body

    // restructure data
    const number_of_questions = parseInt(req.body['number_of_questions'])
    req.body["duration"] = (duration.hour * 3600) + (duration.minutes * 60)

    // generate questions
    let generatedQuestion

    try {
        generatedQuestion = await QuestionModel.aggregate([
            // { $match: { subject: { $in: subjects }, class_level: class_level, topic: { $in: topics } } },
            { $sample: { size: number_of_questions } }
        ])
    } catch (err) {
        const error = new HttpError("Internal Server Error", 500)
        console.log(err)
        return next(error)
    }



    // save object
    const newTest =  new CBTModel({
        user: user.userId,
        class_level: class_level,
        subjects: subjects,
        topics: topics,
        questions: generatedQuestion,
        number_of_questions: number_of_questions,
        duration: req.body["duration"],
        time_left: req.body["duration"]
    })
    try {
        await newTest.save()
    } catch (err) {
        const error = new HttpError("Internal Server Error", 500)
        return next(error)
    }


    console.log(newTest)

    res.json({ ...newTest })
}


exports.createTest = createTest