const express = require('express');

const router = express.Router();

const { loginUser, registerUser } = require('../controller/auth-controller');

//all routes are related to auth

router.post('/register', registerUser)
router.post('/login', loginUser)


module.exports = router;