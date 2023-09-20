const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/usersRoles");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true 
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "field must be a valid email address"]
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
  },
  role: {
    type: String, // ["USER", "ADMIN", MANAGER]
    enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER],
    default: userRoles.USER
  },
  avatar: {
    type: String,
    default: "uploads/profile.jpg"
  }
})


module.exports = mongoose.model("User", userSchema)

