const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SubjectSchema = new Schema({
  name: {type: String, required: true},
  level: [{ type: mongoose.Types.ObjectId, ref: "Class Level" }]
})

module.exports = mongoose.model('Subject', SubjectSchema)