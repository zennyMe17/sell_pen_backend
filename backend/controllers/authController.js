const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if user already exists by email or phone
    const userExists = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, phone, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),  
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by either email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Return user details and token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { signup, login };
