const User = require('../models/users');

const validator = (req) => {
    const { 
        firstName, 
        lastName,
        email,
        state,
        country,
        occupation,
        keySkill,
        profilePicture
    } = req.body;

    return (!(firstName && lastName && email && state && country && occupation && keySkill && profilePicture));
}

const checkUserIdIsUnique = async (id) => {
    const user = await User.findOne({ id: id });
    let newId = id;

    if (user || id === 0) {
        newId = Math.ceil(Math.random() * 1000);
        checkUserIdIsUnique(newId);
    } else {
        return newId;
    }
}

module.exports = {
    validator,
    checkUserIdIsUnique,
}