const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  console.log("protectAdmin");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token and veryfy if it is valid
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      console.log(decode.id);

      // Check if user still exists and get the id
      const user = await User.findById(decode.id).select("-password");
      if (!user) {
        return next(new ErrorResponse("User not found", 404));
      } else if (user.role !== "admin") {
        return next(new ErrorResponse("Not authorized", 401));
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not autherized.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not autherized, no token.");
  }
});

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("protect");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token and veryfy if it is valid
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      console.log(decode.id);

      // Check if user still exists and get the id
      const user = await User.findById(decode.id).select("-password");
      if (!user) {
        return next(new ErrorResponse("User not found", 404));
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not autherized.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not autherized, no token.");
  }
});

module.exports = { protect, protectAdmin };
