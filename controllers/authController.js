const jwt = require("jsonwebtoken");
const sendgridmail = require("@sendgrid/mail");
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
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
    sendgridmail.setApiKey(process.env.SENDGRID_API_KEY);
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
      <h1>Please use the following link to activate your account </h1>
      <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      <hr />
      <p>This email contains sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `,
    };
    await sendgridmail.send(emailData);
    res.status(200).json({
      status: "success",
      message: `Activation link sent to ${email}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error,
      message: error.message,
    });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  try {
    const { name, email, password } = jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION
    );
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User exists with given email");
    }
    await User.create({ name, email, password });
    res.status(200).json({
      status: "success",
      message: "Account creation successful",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const correctCredentials = user.authenticate(password);
      if (!correctCredentials) {
        res.status(401).json({
          status: "fail",
          message: "Bad credentials",
        });
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Bad credentials",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      status: "success",
      token,
      name: user.name,
      email,
      role: user.role,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
