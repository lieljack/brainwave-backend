const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

const HttpError = require("./models/util/HttpErrorModel")
const userRoutes = require("./routes/UserRoutes")

const dbConnectionString = "mongodb://127.0.0.1:27017/brainwave"

const app = express()

// Adds body-parser middleware
app.use(bodyParser.json())

app.use(cors())

app.use("/api/auth", userRoutes)

app.use((req, res, next) => {
  const notFoundError = new HttpError("This route could not be found", 404)
  return next(notFoundError)
})

// This middleware runs after every middleware above it. Especially, it
// runs on every error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "An unknown error occured" })
})

mongoose
  .connect(dbConnectionString)
  .then(() => {
    console.log("Connected to db")
    app.listen(5000)
  })
  .catch(() => {
    console.log("An error occured when connecting to the database")
  })
