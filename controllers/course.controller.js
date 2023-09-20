let { courses } = require("../data/courses")
const { body, validationResult } = require("express-validator");
const Course = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError")


// Get all courses
const getAllCourses = asyncWrapper(
  async (req, res) => {
    const query = req.query;
    console.log("query :", query)

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit

    // Get all courses from DB using Course Model
    const courses = await Course.find({}, {}).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { courses } })

  }
)

// Add Course
const addCourse = asyncWrapper(
  async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = appError.create(errors.array(), 400, httpStatusText.FAIL)

      return next(error);
    }

    const newCourse = new Course(req.body);

    newCourse.save().then(() => console.log("Done"))

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } })

  }
)

// get Course
const getCourse = asyncWrapper(
  async (req, res, next) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
      const error = appError.create("course not found", 404, httpStatusText.FAIL);

      return next(error);
      // return res.status(404).json({ status: httpStatusText.FAIL, data: { course: "Course not found" } })
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } })
  }
)

// Delete Course
const deleteCourse = asyncWrapper(
  async (req, res) => {
    await Course.deleteOne({ _id: req.params.id })
    res.json({ status: httpStatusText.SUCCESS, data: null })
  }
)

// Update Course
const updateCourse = asyncWrapper(
  async (req, res) => {
    const id = req.params.id;
    const updatedCourse = await Course.findByIdAndUpdate(id, { $set: { ...req.body } })
    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course: updatedCourse } });
  }
)

module.exports = {
  getAllCourses,
  addCourse,
  getCourse,
  deleteCourse,
  updateCourse
}