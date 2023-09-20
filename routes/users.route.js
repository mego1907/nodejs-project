const express = require("express");
const { body } = require("express-validator");
const { getAllCourses, addCourse, updateCourse, deleteCourse, getCourse } = require("../controllers/course.controller");
const { validationSchema } = require("../middleware/validationSchema");

const multer = require("multer");

const { getAllUsers, login, register } = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const appError = require("../utils/appError");


const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File :", file);
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    const ext = file.mimetype.split("/")[1];

    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if(imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false)
  }
}

const upload = multer({ 
  storage: diskStorage, 
  fileFilter 
});

const router = express.Router();



// Get all users
router.route("/")
.get(verifyToken, getAllUsers)

// Register
router.route("/register")
.post(upload.single("avatar"), register)

// Login
router.route("/login")
  .post(login)

module.exports = router;