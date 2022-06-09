const User = require("../models/users");

const createUser = async (data) => {
    const {
        id,
        firstName,
        lastName,
        dob,
        email,
        state,
        country,
        occupation,
        keySkill,
        profilePicture
    } = data;

    const userData = {
        id,
        firstName,
        lastName,
        dob,
        email,
        state,
        country,
        occupation,
        keySkill,
        profilePicture  
    };

    const newUser = new User(userData);
    await newUser.save();
}

module.exports = createUser;