const CustomErrorHandler = require("./customErrorHandler");
// const {StatusCodes} = require("http-status-codes");
class NotFoundError extends  CustomErrorHandler {
    constructor(message, statusCode) {
      super(message)
      this.statusCode = StatusCodes.NOT_FOUND;
    }
  }

  module.exports = NotFoundError;