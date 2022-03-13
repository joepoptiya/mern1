const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc  Get all users
// @route GET /api/v1/users
// @access Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc  Get user data
// @route GET /api/v1/users
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc  Register a user
// @route POST /api/v1/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter text field");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash passord
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    salt: salt,
    active: true,
  });

  // check user is created
  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  } else {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  res.status(200).json(user);
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid credentials");
    } else {
      res.status(200).json({
        success: true,
        //token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  }

  res.status(200).json(user);
});

// Generate token
const generateToken = (id) => {
  const options = {
    id,
    role: "admin",
    scope: {
      read: true,
      write: true,
    },
  };
  return jwt.sign(options, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// @desc  Update a user
// @route PUT /api/v1/user/:id
// @access Public
//const updateUser = asyncHandler(async (req, res) => {
//  const User = await User.findById(req.params.id);
//  if (!User) {
//    res.status(400);
//    throw new Error("User not found");
//  }
//
//  if (!req.body.text) {
//    res.status(400);
//    throw new Error("Please enter text field");
//  }
//
//  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//    new: true,
//  });
//  res.status(200).json(updateUser);
//});

// @desc  Export all crud functions
module.exports = {
  getUsers,
  getMe,
  registerUser,
  loginUser,
  //updateUser,
  //deleteUser,
};
