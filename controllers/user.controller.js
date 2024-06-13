const Joi = require("joi");
const User = require("../modules/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  const isValid = Joi.object({
    username: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().required(),
  }).validate(req.body);
  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
    });
  }
  try {
    const userExists = await User.find({
      $or: [{ email: req.body.email, username: req.body.username }],
    });
    if (userExists.length != 0) {
      return res.status(400).send({
        status: 400,
        message: "Username/Email already exists",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Error while checking username and email",
      data: error,
    });
  }
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALTS));

  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const userObj = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role,
  });
  try {
    await userObj.save();
    return res.status(201).send({
      status: 201,
      message: "User registered successfully ",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Error while saving user to DB",
      data: error,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const isValid = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(req.body);
  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
      data: isValid.error,
    });
  }
  let userData;
  try {
    userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).send({
        status: 400,
        message: "No user found please register",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Error while fetching the data",
    });
  }

  const isPasswordSame = await bcrypt.compare(password, userData.password);
  if (!isPasswordSame) {
    return res.status(400).send({
      status: 400,
      message: "Incorrect Password",
    });
  }
  const payload = {
    username: userData.username,
    email: userData.email,
    userId: userData._id,
    role: userData.role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return res.status(201).send({
    status: 201,
    message: "User Logged in Successfully",
    data: [token, userData.role],
  });
};
module.exports = { registerUser, loginUser };
