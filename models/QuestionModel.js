const mongoose = require("mongoose")

const Schema = mongoose.Schema

const OptionSchema = new Schema({
  text: { type: String, required: true },
  correct: { type: Boolean, required: true },
})

const QuestionSchema = new Schema({
  subject: { type: mongoose.Types.ObjectId, ref: "Subject", required: true },
  class_level: {
    type: mongoose.Types.ObjectId,
    ref: "Class Level",
    required: true,
  },
  question: { type: String, required: true },
  options: [OptionSchema],
  published: { type: Boolean },
})

module.exports = mongoose.model("Question", QuestionSchema)
