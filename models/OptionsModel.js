const mongoose = require("mongoose")

const Schema = mongoose.Schema

const OptionSchema = new Schema({
  question: { type: mongoose.Types.ObjectId, ref: "Question", required: true },
  text: { type: String, required: true },
})


module.exports = mongoose.model('Option', OptionSchema)