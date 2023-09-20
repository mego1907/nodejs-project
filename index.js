require("dotenv").config()
// const bodyParser = require("body-parser");
const express = require("express");
const httpStatusText = require("./utils/httpStatusText")
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("mongoose");


app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const url = process.env.MONGO_URL

mongoose.connect(url).then(() => {
  console.log("mongodb connect successfuly")
})


const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route")


app.use(cors());
app.use(express.json());


app.use("/api/courses", coursesRouter);   // localhost / => /api/courses
app.use("/api/users", usersRouter)        // localhost / => /api/users


// global middleware for not found router
app.all("*", (req, res, next) => {
  return res.status(404).json({ status: httpStatusText.ERROR, message: "This resource is not available" }) 
});


// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null })
});




const port = process.env.PORT;
app.listen(port || 5000, () => {
  console.log("Listening on port: 5000");
})
