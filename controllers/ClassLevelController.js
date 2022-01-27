const HttpError = require("../models/util/HttpErrorModel")
const { validationResult } = require("express-validator")
const ClassLevelModel = require("../models/ClassLevelModel")

const createClassLevel = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Validation Error! Please fill the required fields and try again",
        422
      )
    )
  }

  // @ - Todo Check token
  // @ - Todo Check if is admin

  const { classlevel } = req.body

  const newClassLevel = new ClassLevelModel({
    level: classlevel
  })

  try {
    await newClassLevel.save()
  } catch (err) {
    return next(
      new HttpError(
        "An error occured while saving",
        500
      )
    )
  }

  res.status(201).message({message: "Created Successfully"})
}


exports.createClassLevel = createClassLevel