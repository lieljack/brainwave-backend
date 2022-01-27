const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ClassLevelSchema = new Schema({
  level: { type: String, required: true },
  subjects: [{ type: mongoose.Types.ObjectId, ref: "Subject" }]
})


module.exports = mongoose.model('Class Level', ClassLevelSchema)