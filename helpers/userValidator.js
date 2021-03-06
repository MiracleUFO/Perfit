const User = require('../models/users');

const validator = (req) => {
    const { 
        firstName, 
        lastName,
        dob,
        email,
        state,
        country,
        occupation,
        keySkill,
        profilePicture
    } = req.body;

    return (!(firstName && lastName && dob && email && state && country && occupation && keySkill && profilePicture));
}

const checkUserIdIsUnique = async (id) => {
    const user = await User.findOne({ id: id });
    let newId = id;

    if (user) {
        newId = Math.ceil(Math.random() * 1000);
        checkIfIdIsUnique(newId);
    } else {
        return newId;
    }
}

module.exports = {
    validator,
    checkUserIdIsUnique,
}