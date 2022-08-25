const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');

const Auth = require('../models/auth');
const S_Token = require('../models/sessionTokens');
const V_Token = require('../models/verificationTokens');

const baseUrl = require('../helpers/baseUrl');
const {
    required,
    checkUserIdIsUnique,
    passwordValidator
} = require('../helpers/validator');

const mailTransporter = require('../config/nodemailer');

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
        return res.status(409).send({status: 409, error: 'Sorry, must be at least 13 years old to join.'});
    
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

const sendVerificationEmail = async (req, res, next) => {
    const { id } = req.params;
    jwt.sign({ id }, process.env.EMAIL_SECRET, { expiresIn: '3d' },
        (err, token) => {
            if (err) return res.json(500).json({status: 500, error: 'JWT Error: Problem sending verification token.'});
            const formattedToken = { v_token: token };
            try {
                V_Token.findOneAndUpdate({ owner_id: id }, formattedToken, {
                    new: true,
                    upsert: true
                })
                .then(() => {
                    Auth.findOne({ id: id })
                        .then(auth => {
                            if (!auth)
                                return res.status(404).send({ status: 404, error: 'Account does not exist.' })
                            ;
                            const url = `${baseUrl()}/api/auth/verify/${token}`;
                            mailTransporter.sendMail({
                                from: process.env.GMAIL_USER,
                                to: auth.email,
                                subject: 'Verify email to join the Perfit network.',
                                text: `Hey you, please click this: ${url}, to verify yout Perfit freelancer account and add your profile`,
                                html: `<div><h1>Hey you,</h1><p>Please click <a href="${url}">this link</a> to verify your Perfit freelancer account and add your profile.</p></div>`
                            });
                            return res.status(201).json({status: 201, message: 'Verification email sent successfully.'});
                        })
                    ;
                });
            } catch (e) {
                next(err);
            }
        })
    ;
}

const verify = (req, res) => {
    const
        { token } = req.params,
        { id } = jwt.verify(token, process.env.EMAIL_SECRET)
    ;
    if (!id) return res.status(401).json({ status: 401, error: 'Unauthorised.' });
    Auth.findOne({ id })
        .then(auth => {
            if (!auth) res.status(404).json({ status: 404, error: 'Account does not exist.' });
            auth.verified = true;
            auth.save();
            res.status(201).json({ status: 201, message: 'Verified successfully' });
        });
};

const getAuth = (req, res) => {
    /*const token = req.headers['x-perfit-token'];
    if (!token)
        return res.status(401).json({ status: 401, error: 'Unauthorised.' });
    ;
    const { id } = jwt.verify(token, process.env.EMAIL_SECRET);
    if (!id) 
        return res.status(401).json({ status: 401, error: 'Unauthorised.' })
    ;*/
    const { id } = req.params;

    Auth.findOne({ id })
        .then(auth => {
            if (!auth) return res.status(404).send({status: 404, error: 'User does not exist.'});
            const { id, verified } = auth;
            return res.status(200).json({ id, verified });
        })
    ;
};

module.exports = {
    signup,
    getAuth,
    verify,
    sendVerificationEmail
};