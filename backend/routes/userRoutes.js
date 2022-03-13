const express = require("express");
const router = express.Router();

const {
  getUsers,
  getMe,
  registerUser,
  loginUser,
  //updateUser,
  //activateUser,
  //deactivateUser,
} = require(`../controllers/userController`);
const { protect, protectAdmin } = require(`../middleware/authMiddleware`);

router.get(`/`, getUsers);
router.get("/me", protect, getMe);
router.post(`/register`, registerUser);
router.post(`/login`, loginUser);

module.exports = router;
