const { default: mongoose } = require('mongoose');
const User = require('../models/users');

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

const getUser = async (req, res, next) => {
    const {id } = req.params;
    User.findOne({ id: id })
        .then(user => {
            if (!user) return next(404);
            res.status(200).json(user);
        });
}

const editExistingUser = async (req, res, next) => {
    const { id } = req.params;
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

    User.findOneAndReplace({ id: id }, {
        id,
        firstName,
        lastName,
        dob,
        state,
        country,
        email,
        occupation,
        keySkill,
        profilePicture
    }, {
        new: true
    }, (err, user) => {
        if (err) return next(err);
        res.status(200).json(user);
    });
}

const addNewUser = async (req, res, next) => {
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

    let user = await User.findOne({ email: email });

    if (user) {
        next('User exists already.');
    } else {
        const formattedUser = {
            id: Math.ceil(Math.random() * 1000),
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

        try {
            const result = await createUser(formattedUser);
            res.status(201).json(result);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    editExistingUser,
    addNewUser
};