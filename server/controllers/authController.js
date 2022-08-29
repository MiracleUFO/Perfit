const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');

const Auth = require('../models/auth');
const S_Token = require('../models/sessionTokens');
const V_Token = require('../models/verificationTokens');
const R_Token = require('../models/resetPassTokens');

const { serverBase, clientBase } = require('../config/baseUrls');
const {
    required,
    checkUserIdIsUnique,
    passwordValidator
} = require('../helpers/authValidator');

const mailTransporter = require('../config/nodemailer');

const signup = async (req, res, next) => {
    const { 
        email,
        password,
        confirmPass,
        dob
    } = req.body;

    if (!required({ email, password, confirmPass, dob }))
        return res.status(400).json({ status: 400, error: 'Required fields not sent.' });

    const auth = await Auth.findOne({ email: email} );
    if (auth)
        return res.status(409).send({status: 409, error: 'User already exists.'});
    
    if (moment() <= moment(dob))
        return res.status(409).send({ status: 409, error: 'Invalid date of birth.' });
    else if (moment().subtract(13, 'years') < moment(dob))
        return res.status(409).send({ status: 409, error: 'Sorry, must be at least 13 years old to join.' });
    
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
        req.id = newAuth.id;
        sendVerificationEmail(req, res, next);
    } catch (err) {
        next(err);
    }
};

const signin = async (req, res, next) => {
    let 
        { email, password } = req.body,
        userId,
        verified
    ;
    if (req.token) {
        const { id } = jwt.verify(req.token, process.env.EMAIL_SECRET);
        if (!id) return res.status(401).send({ status: 401, error: 'Invalid session.' });
        userId = id;

        const auth = await Auth.findOne({ owner_id: id });
        if (!auth) return res.status(404).send({ status: 404, error: 'Account does not exist.' });

        email = auth.email;
        password = auth.password;
        verified = auth.verified;
    } else {
        if (!email || !password) return res.status(400).json({ status: 400, error: 'Required fields not sent.' });
        const auth = await Auth.findOne({ email });

        if (!auth) return res.status(404).send({ status: 404, error: 'Account does not exist.' });
        userId = auth.id;
        verified = auth.verified;

        const matches = await bcrypt.compare(password, auth.password);
        if (!matches)  return res.status(400).json({ status: 400, error: 'Invalid login.' });
    }

    const jwtPayload = {
        id: userId,
        email,
        password
    };

    const sToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '3d' });
    if (!sToken) return res.json(500).json({ status: 500, error: 'JWT Error: Problem logging in.' });

    const formattedSession = { owner_id: userId, s_token: sToken };
    
    S_Token.findOneAndUpdate({ owner_id: userId }, formattedSession, {
        new: true,
        upsert: true
    })
        .then(newSToken => {
            if (!newSToken) return res.status(401).json({ status: 401, error: 'Failed to verify.' });
            if (req.token) {
                return setTimeout(() => {
                    //  redirects to client when / if verification token is used to automate login.
                    return res.writeHead(303, { Location: `${clientBase}/verify?sToken=${newSToken.s_token}` }).end();
                }, 2500);
            }
            return res.status(201).json({ status: 201, message: 'Login successful.', token: newSToken.s_token, verified, id: userId, email });
        })
    ;
};

const sendVerificationEmail = async (req, res, next) => {
    const id = req.id || req.params.id;
    Auth.findOne({ id: id })
        .then(auth => {
            if (!auth) 
                return res.status(404).send({ status: 404, error: 'Account does not exist.' })
            ;
            if (auth.verified) return res.status(401).json({ status: 401, error: 'User is already verified.' });
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
                                const url = `${serverBase}/api/auth/verify/${token}`;
                                mailTransporter.sendMail({
                                    from: process.env.GMAIL_USER,
                                    to: auth.email,
                                    subject: 'Verify email to join the Perfit network.',
                                    text: `Hey you, please click this: ${url}, to verify your Perfit freelancer account and add your profile`,
                                    html: `<div><h1>Hey you,</h1><p>Please click <a href="${url}">this link</a> to verify your Perfit freelancer account and add your profile.</p></div>`
                                });
                                if (req.id)
                                    return res.status(201).json({status: 201, id: req.id, message: 'Sign up successful. \n Verification email sent.'});
                                return res.status(201).json({status: 201, message: 'Verification email sent successfully.'});
                            })
                        ;
                    } catch (e) {
                        next(err);
                    }
                })
            ;
        })
    ;
}

const verify = (req, res, next) => {
    const
        { token } = req.params,
        { id } = jwt.verify(token, process.env.EMAIL_SECRET)
    ;

    if (!id) return res.status(401).json({ status: 401, error: 'Unauthorised.' });

    V_Token.findOneAndDelete({ v_token: token })
        .then(vToken => {
            if (!vToken) return res.status(401).json({ status: 401, error: 'Expired verification link.' });
            Auth.findOne({ id })
                .then(auth => {
                    if (!auth) res.status(404).json({ status: 404, error: 'Account does not exist.' });
                    if (auth.verified) return res.status(401).json({ status: 401, error: 'User is already verified.' });
                    auth.verified = true;
                    auth.save();
                    req.token = vToken.v_token;
                    signin(req, res, next);
                })
            ;
        })
    ;
};

const sendForgotPasswordEmail = (req, res, next) => {
    const id = req.params.id;
    Auth.findOne({ id: id })
        .then(auth => {
            if (!auth) 
                return res.status(404).send({ status: 404, error: 'Account does not exist.' })
            ;
            jwt.sign({ id }, process.env.EMAIL_SECRET2, { expiresIn: '3d' },
                (err, token) => {
                    if (err) return res.json(500).json({status: 500, error: 'JWT Error: Problem sending verification token.'});
                    const formattedToken = { r_token: token };
                    try {
                        R_Token.findOneAndUpdate({ owner_id: id }, formattedToken, {
                            new: true,
                            upsert: true
                        })
                            .then(() => {
                                const url = `${clientBase}/reset-password?rToken=${token}`;
                                mailTransporter.sendMail({
                                    from: process.env.GMAIL_USER,
                                    to: auth.email,
                                    subject: 'Reset your Perfit freelancer account password',
                                    text: `Hey you, please click this: ${url}, to reset your password`,
                                    html: `<div><h1>Hey you,</h1><p>Please click <a href="${url}">this link</a> to reset your password.</p>If you didn't choose to reset your password, please ignore this email.</p></div>`
                                });
                                return res.status(201).json({status: 201, message: 'Verification email sent successfully.'});
                            })
                        ;
                    } catch (e) {
                        next(err);
                    }
                })
            ;
        })
    ;
};

const resetPassword = (req, res) => {
    const
        { token } = req.params,
        { id } = jwt.verify(token, process.env.EMAIL_SECRET2)
    ;
    if (!id) return res.status(401).json({ status: 401, error: 'Unauthorised.' });

    const {
        password,
        confirmPass
    } = req.body;
    
    const passError = passwordValidator(password, confirmPass);
    if (passError)
        return res.status(400).send({status: 400, error: passError})
    ;

    R_Token.findOneAndDelete({ r_token: token })
        .then(rToken => {
            if (!rToken) return res.status(401).json({ status: 401, error: 'Expired reset link.' });
            Auth.findOne({ id })
                .then(auth => {
                    if (!auth) res.status(404).json({ status: 404, error: 'Account does not exist.' });
                    const salt = bcrypt.genSaltSync(10);
                    passHash = bcrypt.hashSync(password, salt);
                    auth.password =  passHash;
                    auth.save();
                    return res.status(201).json({ status: 201, message: 'Password reset succesful.'});
                ;
                })
            ;
        })
    ;
};

const getAuth = (req, res) => {
    const { id, verified, email } = req.auth;
    return res.status(200).json({ status: 200, email, id, verified, token: req.params.token });
};

module.exports = {
    signup,
    signin,
    getAuth,
    verify,
    resetPassword,
    sendVerificationEmail,
    sendForgotPasswordEmail
};