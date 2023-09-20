const express = require("express");
const { body } = require("express-validator");
const { getAllCourses, addCourse, updateCourse, deleteCourse, getCourse } = require("../controllers/course.controller");
const { validationSchema } = require("../middleware/validationSchema");
const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utils/usersRoles");
const allowedTo = require("../middleware/allowedTo")

const router = express.Router();

// get all courses
router.route("/")
  .get(getAllCourses)
  .post(verifyToken, validationSchema(), addCourse);

// get single course
router.route(`/:id`)
  .get(getCourse)
  .patch(updateCourse)
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), deleteCourse)



module.exports = router;