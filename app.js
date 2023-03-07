require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectionDB = require("./db/connect");
const bookRoutes = require("./route/booksRoutes");
const adminRoutes = require("./route/adminRoutes");
const notFound = require("./middleware/not-found");
// const authenticator = require("./middleware/auth")
const errorHandler = require("./middleware/errorHandler");

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1/books/uploads", express.static("uploads"));

// routers
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/books", bookRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectionDB(process.env.MONGO_URI);
    app.listen(PORT,  () =>
      console.log(`Server is listening on port ${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();


// "192.168.5.76",