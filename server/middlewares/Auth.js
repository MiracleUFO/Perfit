const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');
const S_Token = require('../models/sessionTokens');

const exists = async (req, res, next) => {
    const auth = await Auth.findOne({ email: req.body.email });
    if (!auth)
        return res.status(404).json({status: 404, error: 'Account not found. Sign up for an account.'})
    ;
    req.id = auth.id;
    next();
};

const getAuthMw = (req, res, next) => {
    const id = req.params.id || req.id;
    Auth.findOne({ id })
        .then(auth => {
            if (!auth) return res.status(404).send({status: 404, error: 'Account does not exist.'});
            req.auth = auth;
            next();
        })
    ;
};

const isSTokenValid = async (req, res, next) => {
    const 
        token = req.params.token || req.header('x-auth-token'),
        { id } = jwt.verify(token, process.env.JWT_SECRET),
        sToken = await S_Token.findOne({ owner_id: id })
    ;
    if (!id || !sToken) return res.status(401).send({ status: 401, error: 'Unauthorised.' });
    req.id = id;
    next();
};

module.exports = {
    exists,
    getAuthMw,
    isSTokenValid
};