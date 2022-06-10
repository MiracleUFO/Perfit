const User = require('../models/users');

const validator = (req, res) => {
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

    if (!(firstName && lastName && dob && email && state && country && occupation && keySkill && profilePicture)) {
        return res.status(400).json({status: 400, message: 'Required fields not sent'});
    }
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
    checkUserIdIsUnique
}