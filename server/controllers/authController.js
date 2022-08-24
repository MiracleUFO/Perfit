const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Auth = require('../models/auth');
const moment = require('moment');
const { required, checkUserIdIsUnique, passwordValidator } = require('../helpers/validator');

const signup = async (req, res, next) => {
    const { 
        email,
        password,
        confirmPass,
        dob
    } = req.body;

    if (!required({ email, password, confirmPass, dob }))
        return res.status(400).json({status: 400, error: 'Required fields not sent.'});

    const auth = await Auth.findOne({email: email});
    if (auth)
        return res.status(409).send({status: 409, error: 'User already exists.'});
    
    if (moment() <= moment(dob))
        return res.status(409).send({status: 409, error: 'Invalid date of birth.'});
    else if (moment().subtract(13, 'years') < moment(dob))
        return res.status(409).send({status: 409, error: 'Must be at least 13 years old to join platform.'});
    
    const passError = passwordValidator(password, confirmPass);
    if (passError)
        return res.status(400).send({status: 400, error: passError});
    
    const 
        salt = await bcrypt.genSalt();
        passHash = bcrypt.hashSync(password, salt)
    ;

    const formattedAuth = {
        email,
        dob,
        id: Math.ceil(Math.random() * 1000),
        password: passHash,
        verified: false,
    };

    formattedAuth.id = await checkUserIdIsUnique(formattedAuth.id);
    try {
        newAuth = new Auth(formattedAuth);
        await newAuth.save();
        return res.status(201).json({status: 201, message: 'Sign up successful.'});
    } catch (err) {
        next(err);
    }
};

const getAuth = (req, res, next) => {
    const { email } = req.params;
    // email will be removed to use token from headers to find .decrypt or something. Token will be created with id and long secret.
    Auth.findOneAndDelete({email: email})
        .then((err, auth) => {
            if (err) return next(err);
            if (!auth) return res.status(404).send({status: 404, error: 'User does not exist.'});
            const { id, email, verified } = auth;
            return res.status(200).json({id, email, verified});
        })
    ;
};

module.exports = {
    signup,
    getAuth
};