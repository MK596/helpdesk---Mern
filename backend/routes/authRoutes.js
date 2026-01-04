const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
