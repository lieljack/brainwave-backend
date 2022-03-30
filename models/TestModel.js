const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TestSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    class_level: { type: mongoose.Types.ObjectId, ref: "Class Level" },
    subjects: [{ type: mongoose.Types.ObjectId, ref: "Subject" }],
    topics: [{ type: mongoose.Types.ObjectId, ref: "Topic" }],
    number_of_questions: { type: Number, required: true },
    questions: [{ type: Object }],
    duration: { type: Number },
    time_left: { type: Number }
})

module.exports = mongoose.model('CBT', TestSchema)