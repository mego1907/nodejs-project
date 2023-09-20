const { body } = require("express-validator")


const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title at least is 2 chars"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
  ]
}

module.exports = {
  validationSchema
}
