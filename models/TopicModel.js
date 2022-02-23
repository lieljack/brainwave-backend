const mongoose = require("mongoose")

const Schema = mongoose.Schema

const TopicSchema = new Schema({
  subject: { type: mongoose.Types.ObjectId, ref: "Subject", required: true },
  topic: { type: String, required: true },
})

module.exports = mongoose.model("Topic", TopicSchema)