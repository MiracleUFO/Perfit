const express = require('express');
const router = express.Router();

const {
    signup,
    signin,
    verify,
    getAuth,
    sendVerificationEmail
} = require('../controllers/authController');

const {
    exists,
    checkTokenValid,
} = require('../middlewares/Auth');

router.post('/sign-up', signup);

router.get('/verify/:token', verify);

/*router.post('/sign-in', exists, checkTokenValid, signin);

router.get('/:id', getAuth); // session :token will be removed to use token to find out. To check if user is verified in auth sends back email & verified, current user just check both user's mails if same.*/

router.get('/resend-verify-token/:id', sendVerificationEmail);

module.exports = router;

//  Middlewares
//  exists: allows user add profile, addProfile to know if exists in profile check if token is valid, then check if user exists in profile with id from token decryption