const Auth = require('../models/auth');

const exists = async (req, res, next) => {
    const { auth: id } = await Auth.findOne({ email: email });
    if (!auth)
        return res.status(404).json({status: 404, error: 'Account not found. Sign up for an account.'})
    ;
    req.body.id = id;
    next();
};

module.exports = exists;