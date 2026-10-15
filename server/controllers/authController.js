const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'onss_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { fname, fullName, mobno, mobileNumber, email, password } = req.body;

    const name = fullName || fname;
    const mobile = mobileNumber || mobno;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, mobile number, email, and password.',
      });
    }

    // Check if email or mobile number already exists (equivalent to PHP signup check)
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { mobileNumber: mobile.trim() }],
    });

    if (existingUser) {
      const isEmail = existingUser.email.toLowerCase() === email.toLowerCase().trim();
      return res.status(400).json({
        success: false,
        message: isEmail
          ? 'Email address is already registered. Please sign in or use another email.'
          : 'Mobile number is already registered. Please sign in or use another number.',
      });
    }

    const user = await User.create({
      fullName: name.trim(),
      mobileNumber: mobile.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'You have successfully registered!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        regDate: user.regDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { emailormobnum, identifier, email, password } = req.body;
    const loginIdentifier = (emailormobnum || identifier || email || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or mobile number and password.',
      });
    }

    // Match either Email or MobileNumber (exact PHP parity)
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { mobileNumber: loginIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/mobile or password.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        regDate: user.regDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Reset password with Email + Mobile verification
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email, mobile, mobileNumber, newpassword, newPassword } = req.body;
    const phone = (mobileNumber || mobile || '').trim();
    const mail = (email || '').toLowerCase().trim();
    const updatedPass = newPassword || newpassword;

    if (!mail || !phone || !updatedPass) {
      return res.status(400).json({
        success: false,
        message: 'Please provide registered email, mobile number, and new password.',
      });
    }

    const user = await User.findOne({
      email: mail,
      mobileNumber: phone,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email address or Mobile number does not match our records.',
      });
    }

    user.password = updatedPass;
    await user.save();

    res.json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, name, fname, mobileNumber, mobilenumber, mobno, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newName = fullName || name || fname;
    const newMobile = mobileNumber || mobilenumber || mobno;

    if (newName) user.fullName = newName.trim();
    if (newMobile) user.mobileNumber = newMobile.trim();

    if (email && email.toLowerCase().trim() !== user.email) {
      // Check if new email is taken
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another account.',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile has been successfully updated!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        regDate: user.regDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password (validates current password)
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentpassword, currentPassword, newpassword, newPassword } = req.body;
    const oldPass = currentPassword || currentpassword;
    const newPass = newPassword || newpassword;

    if (!oldPass || !newPass) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current password and new password.',
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(oldPass);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Your current password is wrong.',
      });
    }

    user.password = newPass;
    await user.save();

    res.json({
      success: true,
      message: 'Your password has been successfully changed!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  changePassword,
};
