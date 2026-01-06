const express = require('express');
const router = express.Router();
const { signup, login, getMe, refreshToken, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);

module.exports = router;

