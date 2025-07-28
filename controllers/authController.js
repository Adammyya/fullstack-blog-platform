const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- VIEW CONTROLLERS ---

// Show the registration page
const getRegisterPage = (req, res) => {
  res.render('register');
};

// Show the login page
const getLoginPage = (req, res) => {
  res.render('login');
};

// --- API & FORM CONTROLLERS ---

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      req.flash('error_msg', 'A user with that email already exists.');
      return res.redirect('/register');
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // On successful registration, set flash message and redirect to login page
    req.flash('success_msg', 'You have successfully registered! Please log in.');
    res.redirect('/login');
  } catch (error) {
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Invalid credentials. Please try again.');
      return res.redirect('/login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials. Please try again.');
      return res.redirect('/login');
    }

    // If login is successful, create a session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    req.flash('success_msg', 'You are now logged in!');
    res.redirect('/'); // Redirect to homepage
  } catch (error) {
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
};

// Logout a user
const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      req.flash('error_msg', 'Could not log you out.');
      return res.redirect('/');
    }
    req.flash('success_msg', 'You have been logged out.');
    res.clearCookie('connect.sid'); // Clears the session cookie
    res.redirect('/login');
  });
};

module.exports = {
  getRegisterPage,
  getLoginPage,
  registerUser,
  loginUser,
  logoutUser
};