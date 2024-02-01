// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();



const authenticate = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Check if the token is present
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token contains a valid user ID
    if (!decoded.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token payload' });
    }

    // Find the user based on the decoded information
    const user = await User.findById(decoded.id);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    // Set the user information in req.user for further use
    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role,
      year: user.year,
      class: user.class,
      section: user.section,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authenticate;


