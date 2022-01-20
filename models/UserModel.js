const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const Schema = mongoose.Schema

const UserModelSchema = new Schema({
  last_name: { type: String, required: true },
  first_name: { type: String, required: true },
  email: { type: String, required: true, minLength: 6, unique: true },
  profile_image: { type: String },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  active: { type: Boolean, required: true },
})

UserModelSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", UserModelSchema)
