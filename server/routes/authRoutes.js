const express = require('express');
const router = express.Router();

router.post('/sign-up');

router.post('/sign-in');

router.post('sign-out');

router.post('/verify');

router.post('/isTokenValid'); //

router.get('/:id'); // To check if user is verified in auth, current user just check both user's mails if same.

//Middlewares
// exists: allows user add profile, addProfile: tokenisvalid (error ask to sign in.)