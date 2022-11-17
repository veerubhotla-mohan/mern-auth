const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRouter = require("./routes/authRoutes");

dotenv.config({
  path: "./config.env",
});

mongoose
  .connect(
    process.env.MONGODB_URI.replace("<user>", process.env.MONGODB_USER).replace(
      "<password>",
      process.env.MONGODB_PASSWORD
    ),
    {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    }
  )
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((error) => {
    console.log("Error connecting to DB", error);
  });

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
}
app.use("/api", authRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("APP STARTED");
});
