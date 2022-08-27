const express = require('express');
const router = express.Router();
const {
    signup,
    signin,
    verify,
    getAuth,
    sendVerificationEmail,
    isSTokenValid
} = require('../controllers/authController');
const exists = require('../middlewares/Auth');

router.post('/sign-up', signup);

router.post('/sign-in', exists, signin);

router.get('/verify/:token', verify);

router.get('/resend-verify-token/:id', sendVerificationEmail);

router.get('/:id', getAuth);

router.get('/is-token-valid/:token', isSTokenValid);

module.exports = router;

//  Middlewares
//  exists: allows user add profile, addProfile to know if exists in profile check if token is valid, then check if user exists in profile with id from token decryption