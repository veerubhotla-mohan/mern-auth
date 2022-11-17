const express = require("express");
const { signup } = require("../controllers/authController");
const { userSignupValidator } = require("../validators/authValidator");
const { runValidation } = require("../validators/indexValidator");
const authRouter = express.Router();

authRouter.post("/signup", userSignupValidator, runValidation, signup);

module.exports = authRouter;
