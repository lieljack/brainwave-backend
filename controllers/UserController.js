const UserModel = require("../models/UserModel")
const { validationResult } = require("express-validator")
const HttpError = require("../models/util/HttpErrorModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_PHRASE = 'epilepsy_surfboard_legend_rubbed'

const signup = async (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(new HttpError("Validation Error! Please fill the required fields and try again", 422))
  }

  const { first_name, last_name, email, password } = req.body

  let existingUser

  // @- Check if a user with the email address exists
  try {
    existingUser = await UserModel.findOne({ email: email })
  } catch (err) {
    console.log(err);
    const error = new HttpError("An error occured while finding existing user", 500)
    return next(error)
  }

  if(existingUser) {
    const error = new HttpError("User already exist", 422)
    return next(error)
  }

  
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch(err) {
    const error = new HttpError("Internal server error", 500)
    return next(error)
  }

  const user = new UserModel({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    isAdmin: false,
    active: true
  })

  try {
    await user.save()
  } catch (err) {
    const error = new HttpError("Internal server error", 500)
    return next(error)
  }

  res.status(201).json({ message: "ok" })
}


const login = async (req, res, next) => {
  const { email, password } = req.body

  // Find user by email
  let existingUser
  try {
    existingUser = await UserModel.findOne({ email: email })
  } catch (err) {
    console.log(err);
    const error = new HttpError("An error occured while finding existing user", 500)
    return next(error)
  }

  if(!existingUser) {
    const error = new HttpError("User does not exist", 400)
    return next(error)
  }

  let isValidPassword
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    const error = new HttpError("Error comparing passwords", 500)
    return next(error)
  }

  if(!isValidPassword){
    const error = new HttpError("Wrong password", 400)
    return next(error)
  }

  let token
  try {
    token = await jwt.sign({userId: existingUser.id}, SECRET_PHRASE, {expiresIn: '1h'})
  } catch (err) {
    const error = new HttpError("Error creating token", 500)
    return next(error)
  }

  res.json({token: token, userId: existingUser.id, isAdmin: existingUser.isAdmin})
}


// @ Module Exports
exports.signup = signup
exports.login = login