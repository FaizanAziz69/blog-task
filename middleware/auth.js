const jwt = require('jsonwebtoken');
const sequelize = require('../db/configDb.js');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No bearer token provided' });
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); 

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};



module.exports = authMiddleware;
