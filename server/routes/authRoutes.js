const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/signup', register); // Alias for signup
router.post('/login', login);
router.post('/signin', login); // Alias for signin
router.post('/forgot-password', forgotPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
