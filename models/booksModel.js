const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must require a name"],
    trim: true,
    maxlength: [50, "Name must be within 50 characters"],
  },
  author: {
    type: String,
    default: null,
    trim: true,
    maxlength: [30, "Name must be within 30 characters"],
  },
  description: {
    type: String,
    default: null,
    trim: true,
    maxlength: [5000, "Description must not be more than 100 characters long"],
  },
  price: {
    type: Number,
    required : [true, "Book's price must be included"],
    trim: true,
    max: 5000,
    min: 50,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  cover: {
    type: String,
  },
});

module.exports = mongoose.model("Book", BookSchema);
