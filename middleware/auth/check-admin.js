const HttpError = require('../../models/util/HttpErrorModel')
const UserModel = require('../../models/UserModel')

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next()
  }

  const { userId } = req.userData

  let existingUser
  try{
    existingUser = await UserModel.findById(userId)
  } catch(err) {
    const error = new HttpError("Server Error", 500)
    return next(error)
  }
  
  if(!existingUser) {
    const error = new HttpError("Error! User Does Not Exist", 404)
    return next(error)
  }
  
  if(existingUser.isAdmin === true) {
    return next()
  } else {
    const error = new HttpError("Error! User Not Permitted", 403)
    return next(error)
  }
}