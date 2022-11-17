const User = require("../models/User");

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error("User exists with given email");
    const newUser = {
      name,
      email,
      password,
    };
    await User.create(newUser);
    res.status(200).json({
      status: "success",
      message: "User created",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
