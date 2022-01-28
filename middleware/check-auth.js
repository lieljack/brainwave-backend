require("dotenv").config()
const jwt = require("jsonwebtoken")

const HttpError = require("../models/util/HttpErrorModel")

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next()
  }
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
      const err = new HttpError("Authentication Failed!", 401)
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_PHRASE)
    req.userData = { userId: decodedToken.userId }
    next()
  } catch (err) {
    const error = new HttpError("Authentication Failed", 401)
    return next(error)
  }
}
