const Book = require("../models/booksModel");
const asyncWrapper = require("../middleware/asyncWrapper");
const { StatusCodes } = require("http-status-codes");
// const NotFoundError = require("../error/notFoundError")
const CustomErrorHandler = require("../error/customErrorClass");


const getAllBooks = asyncWrapper(async (req, res) => {
  const { availability, name, author } = req.query;
  const queryObject = {};
  if (availability) {
    queryObject.availability = availability === "true" ? true : false;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (author) {
    queryObject.author = { $regex: author, $options: "i" };
  }

  const books = await Book.find(queryObject).sort("name");
  res.status(200).json(books);
});

const createBook = asyncWrapper(async (req, res) => {
  const book = Book(req.body);
  if (req.file) {
    book.cover = req.file.path;
  }
  await book.save();
  res.status(201).json({msg : "Book creation successful.", book});
});

const getBook = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  id_length = req.params.id.length;
  if (id_length > 24 || id_length < 24) {
    return next(new CustomErrorHandler(`No book found by id ${id}`, 404));
  }
  const book = await Book.findById(id);
  if (!book) {
    return next (new CustomErrorHandler(`No book found by id ${id}`, 404));
    // return next new NotFoundError(`No book found by id ${id}`)
  }

  res.status(200).json(book);
});

const updateBook = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  id_length = req.params.id.length;
  if (id_length > 24 || id_length < 24) {
    return next(
      new CustomErrorHandler(
        `No book found by id ${id}`,
        404
      )
    );
  }

  const book = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return next(new CustomErrorHandler(`No book found by id ${id}`, 404));
    // return next new NotFoundError(`No book found by id ${id}`)
  }
  res.status(201).json({msg : "Book updation successful" ,book});
});

const deleteBook = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  id_length = req.params.id.length;
  if (id_length > 24 || id_length < 24) {
    return next(
      new CustomErrorHandler(
        `No book found by id ${id}`,
        404
      )
    );
  }
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    return next(new CustomErrorHandler(`No book found by id ${id}`, 404));
    // return next new NotFoundError(`No book found by id ${id}`)
  }
  res.status(200).json({msg : "Book deletion successful" ,book});
});

module.exports = {
  getAllBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
};
