const User = require('../models/users');
const { validator, checkUserIdIsUnique }= require('../helpers/userValidator');

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
        .then(user => {
            if (!user) return res.status(404).json({status: 404, message: 'User does not exist.'});
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

    validator(req, res);

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
        if (!user) return res.status(404).json({status: 404, message: 'User does not exist.'});
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

    validator(req, res);

    const user = await User.findOne({ email: email });

    if (user) {
        return res.status(409).send({error: 'User already exists'});
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

        formattedUser.id = await checkUserIdIsUnique(formattedUser.id);

        try {
            await createUser(formattedUser);
            res.status(201).json({status: 201, message: 'New user created.'});
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