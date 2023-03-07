const CustomErrorHandler = require("../error/customErrorClass");
// const {StatusCodes} = require("http-status-codes")
const errorHandler = (err, req, res, next) => {
    // console.log(err.name, err.code)
  if (err instanceof CustomErrorHandler) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message, stack: err.stack });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({
      msg: Object.values(err.errors).map((item) => item.message).join(','),
      stack: err.stack,
    });
  }

  if (err.code === 11000) {
    // console.log(Object.keys(err.keyValue))
    return res
      .status(400)
      .json({
        msg: `Duplication error! Duplicate value entered for ${Object.keys(err.keyValue)} please choose a different value`,
        stack: err.stack,
      });
  }
  console.log(err.name)
  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again", stack: err.stack });
};
module.exports = errorHandler;
