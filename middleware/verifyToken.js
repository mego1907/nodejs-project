const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText")

// Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["Authorization"] || req.headers["authorization"];

  // Check if authHeader doesn't exist
  if(!authHeader) {
    const error = appError.create("token is required", 401, httpStatusText.ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  try{

    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next()
  
  } catch(err) {
  
    const error = appError.create("invalid token", 401, httpStatusText.ERROR);
    next(error);

  }

}

module.exports = verifyToken