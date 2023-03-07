const mongoose = require("mongoose");

const connectionDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("Successfully connected to DB... "))
    .catch((err) => console.log(err));
};


module.exports = connectionDB