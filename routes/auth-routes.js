const express = require('express');

const router = express.Router();

const { loginUser, registerUser, changePassword } = require('../controller/auth-controller');

const authMiddleware = require('../middleware/auth-middleware');

//all routes are related to auth

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password',authMiddleware, changePassword)


module.exports = router;