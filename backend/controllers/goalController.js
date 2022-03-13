const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// @desc  Get all goals
// @route GET /api/v1/goals
// @access Public
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

// @desc  Set a goal
// @route POST /api/v1/goals
// @access Public
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please enter text field");
  }

  const goal = await Goal.create({ text: req.body.text, user: req.user.id });

  res.status(200).json(goal);
});

// @desc  Update a goal
// @route PUT /api/v1/goals/:id
// @access Public
const updateGoal = asyncHandler(async (req, res) => {
  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // If now text is provided, can't complete operation
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please enter text field");
  }

  // Find goal
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // If user is not the owner of the goal, can't complete operation
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updateGoal);
});

// @desc  Delete a goal
// @route DELETE /api/v1/goals/:id
// @access Public
const deleteGoal = asyncHandler(async (req, res) => {
  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Find goal
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // If user is not the owner of the goal, can't complete operation
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Goal.findByIdAndRemove(req.params.id);
  res.status(200).json({ id: req.params.id });
});

// @desc  Export all crud functions
module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
