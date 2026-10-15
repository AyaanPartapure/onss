const User = require('../models/User');
const Note = require('../models/Note');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Attach note count per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const noteCount = await Note.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          noteCount,
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user and their notes (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    // Delete user's notes
    await Note.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated notes deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
};
