const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) {
    res.status(401);
    throw new Error('Not logged in. Please sign in to continue.');
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) throw new Error('user missing');
    req.user = user;
    next();
  } catch {
    res.status(401);
    throw new Error('Session expired. Please sign in again.');
  }
});
