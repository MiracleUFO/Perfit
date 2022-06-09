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

const getUsers = async (req, res) => {
    User.find({})
        .then(users => res.send(users));
}

const getUser = async (req, res) => {
    const {id } = req.params;
    User.findOne({ id: id })
        .then(user => res.send(user));
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    /* addNewUser,
    editExistingUser */
};