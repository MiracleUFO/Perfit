const { passwordStrength } = require('check-password-strength');
const User = require('../models/users');

const required = (req) => {
    return Object.values(req).every(prop => !!prop);
}

const checkUserIdIsUnique = async (id) => {
    const user = await User.findOne({ id: id });
    let newId = id;

    if (user || id === 0) {
        newId = Math.ceil(Math.random() * 1000);
        checkUserIdIsUnique(newId);
    }
    return newId;
};

const passwordValidator = (password, confirmPass) => {
    let error = '';
    console.log(passwordStrength(password).id);
    if (password !== confirmPass)
        error = 'Confirm password not the same.';
    else {
        if (!((passwordStrength(password).id === 2) || (passwordStrength(password).id === 3))) {
            error = 'Password too weak';
        }
    }
    return error;
};

module.exports = {
    required,
    checkUserIdIsUnique,
    passwordValidator,
};