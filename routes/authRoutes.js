const express = require("express");
const {
  signup,
  activateAccount,
  signin,
} = require("../controllers/authController");
const { userSignupValidator } = require("../validators/authValidator");
const { runValidation } = require("../validators/indexValidator");
const authRouter = express.Router();

authRouter.post("/signup", userSignupValidator, runValidation, signup);
authRouter.post("/signin", signin);
authRouter.post("/activateAccount", activateAccount);

module.exports = authRouter;
