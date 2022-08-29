const express = require('express');
const router = express.Router();
const { 
    exists,
    getAuthMw,
    isSTokenValid
} = require('../middlewares/Auth');
const {
    signup,
    signin,
    verify,
    resetPassword,
    getAuth,
    sendVerificationEmail,
    sendForgotPasswordEmail,
} = require('../controllers/authController');

router.post('/sign-up', signup);

router.post('/sign-in', exists, signin);

router.get('/forgot-password/:id', sendForgotPasswordEmail);

router.post('/reset-password/:token', resetPassword);

router.get('/verify/:token', verify);

router.get('/resend-verify-token/:id', sendVerificationEmail);

router.get('/:id', getAuthMw, getAuth);

router.get('/is-token-valid/:token', isSTokenValid, getAuthMw, getAuth);

module.exports = router;