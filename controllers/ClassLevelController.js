const HttpError = require("../models/util/HttpErrorModel")
const { validationResult } = require("express-validator")
const ClassLevelModel = require("../models/ClassLevelModel")

const createClassLevel = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Validation Error! Fill the required fields and try again",
        422
      )
    )
  }

  const { classlevel } = req.body

  let existingClassLevel
  try {
    existingClassLevel = await ClassLevelModel.findOne({ level: classlevel })
  } catch (err) {
    return next(new HttpError("A server error occured", 500))
  }

  if (existingClassLevel) {
    const err = new HttpError("Class level already exist", 422)
    return next(err)
  }

  const newClassLevel = new ClassLevelModel({
    level: classlevel,
  })

  try {
    await newClassLevel.save()
  } catch (err) {
    return next(new HttpError("An error occured while saving", 500))
  }
  
  res.status(201).json({ message: "Created Successfully" })
}

// Get All Objects
const getAllClassLevels = async (req, res, next) => {
  let classLevels

  try {
    classLevels = await ClassLevelModel.find()
  } catch(err) {
    return next(new HttpError("Server error!", 500))
  }
  
  if(!classLevels) {
    return next(new HttpError("No Class Level Found!", 404))
  }

  res.json(classLevels)
}

// Get Single Object
const getClassLevelById = async (req, res, next) => {
  const {classId} = req.params
  
  let classLevelObject
  try {
    classLevelObject = await ClassLevelModel.findById(classId)
  } catch (error) {
    return next(new HttpError("Server error!", 500))
  }

  if(!classLevelObject) {
    return next(new HttpError("No Class Level Found!", 404))
  }
  
  res.json(classLevelObject)
}

exports.createClassLevel = createClassLevel
exports.getAllClassLevels = getAllClassLevels
exports.getClassLevelById = getClassLevelById