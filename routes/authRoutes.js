const express = require('express');
const {
    loginController,
    signUpController,
    verifyEmailController,
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginController);
router.post('/signUp', signUpController);
router.get('/verify', verifyEmailController);

module.exports = router;
