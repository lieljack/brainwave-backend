const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const SubjectSchema = new Schema({
  name: {type: String, required: true, unique: true},
  level: [{ type: mongoose.Types.ObjectId, ref: "Class Level" }]
})

SubjectSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Subject', SubjectSchema)