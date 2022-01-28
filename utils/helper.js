require("dotenv").config()
const jwt = require("jsonwebtoken")

const REFRESH_PHRASE = process.env.JWT_REFRESH_PHRASE

const verifyRefresh = (userId, refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_PHRASE)
    return decoded.userId === userId
  } catch (err) {
    return false
  }
}


module.exports = { verifyRefresh }
