const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const httpStatusText = require("../utils/httpStatusText");
const generateJWT = require("../utils/generateJWT");



// Get All Users
const getAllUsers = asyncWrapper(async (req, res) => {

  // console.log(req.headers);
  const { Authorization } = req.headers;

  console.log("headers :", req.headers)

  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  // get all users from DB using User Model
  const users = await User.find({}, {"__v": false, password: false}).limit(limit).skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: {users}})
})

// Register New User
const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role, avatar } = req.body;
  console.log("req.file ->", req.file)

  const oldUser = await User.findOne({ email: email });
  if(oldUser) {
    const error = appError.create("User already exists", 400, httpStatusText.FAIL);
    return next(error);
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  });

  // Generate JWT token
  const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role })
  newUser.token = token;

  await newUser.save();

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } })

})

// Login User
const login = asyncWrapper(async(req, res, next) => {
  const { email, password } = req.body;

  if(!email && !password) { 
    const error = appError.create("email and password are required", 400, httpStatusText.FAIL);
    return next(error);
  }

  const user = await User.findOne({ email: email });
  
  // Error message when user doesn't exist
  if(!user) {
    const error = appError.create("user not found", 400, httpStatusText.FAIL);
    return next(error)
  }
  
  const matchedPassword = await bcrypt.compare(password, user.password);
  if(user && matchedPassword) {
    // Logged in successfuly
    const token = await generateJWT({ email: user.email, id: user._id, role: user.role })

    return res.json({ status: httpStatusText.SUCCESS, data: { token }})
  } else {
    const error = appError.create("something wrong", 500, httpStatusText.ERROR);
    return next(error);
  }


})


module.exports = {
  getAllUsers,
  register,
  login
}
