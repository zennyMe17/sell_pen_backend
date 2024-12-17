const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    console.log("Im in backend try block 1")
    console.log(email)
    console.log(phone)
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    console.log("Im in backend try block 2")
    console.log(email)
    console.log(userExists)
    if (userExists) {
      return res.status(400).json({ message: 'User already hai' });
    }
    console.log("Im in backend try block 3")
    
    console.log(name)
    console.log(email)
    console.log(phone)
    console.log(password)
    const user = await User.create({ name, email, phone, password });
    console.log("Creating New User")
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),  
      });
    } else {
      console.log("im in backend try block 4 user not created")
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
    
    console.log(user.id)
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
