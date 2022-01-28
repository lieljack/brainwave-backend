const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const ClassLevelSchema = new Schema({
  level: { type: String, required: true, unique:true },
  subjects: [{ type: mongoose.Types.ObjectId, ref: "Subject" }]
})

ClassLevelSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Class Level', ClassLevelSchema)