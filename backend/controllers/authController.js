const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    // Find if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check for first user to make admin
    const isFirstUser = (await User.countDocuments({})) === 0;

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: isFirstUser ? 'admin' : 'user'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check user and password match
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    };
    res.status(200).json(user);
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});


// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log(`Forgot password request for: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`User not found: ${email}`);
        res.status(404);
        throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(`Generated reset token: ${resetToken}`);

    // Hash and set reset token to field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // In a real app, send email here. 
    // For this simulation, we return the token directly so the UI can use it.
    res.status(200).json({
        message: 'Password reset token generated',
        resetToken: resetToken // Only returning for dev/testing ease
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired reset token');
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        message: 'Password reset successful',
    });
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    forgotPassword,
    resetPassword
};
