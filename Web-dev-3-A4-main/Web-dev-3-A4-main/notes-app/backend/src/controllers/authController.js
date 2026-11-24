const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

const respond = (res, user, status = 200) =>
  res.status(status).json({
    token: signToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email },
  });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  const user = await User.create({ name, email, password });
  respond(res, user, 201);
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Incorrect email or password');
  }
  respond(res, user);
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ user: { _id, name, email } });
});
