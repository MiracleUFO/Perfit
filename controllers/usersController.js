const User = require('../models/users');
const { validator, checkUserIdIsUnique } = require('../helpers/userValidator');

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
        .then(users => res.status(200).send(users));
}

const getUser = async (req, res) => {
    const {id } = req.params;
    User.findOne({ id: id })
        .then(user => {
            if (!user) return res.status(404).send({status: 404, error: 'User does not exist.'});
            const {  
                firstName,
                lastName,
                occupation,
                state,
                country,
                keySkill,
                profilePicture
            } = user;

            const filteredUser = {
                firstName,
                lastName,
                occupation,
                state,
                country,
                keySkill,
                profilePicture
            }

            res.status(200).json(filteredUser);
        });
}

const editExistingUser = async (req, res, next) => {
    const { id } = req.params;
    const { 
        firstName, 
        lastName,
        state,
        country,
        occupation,
        keySkill,
        profilePicture
    } = req.body;

    const filteredInfo = {
        firstName, 
        lastName,
        state,
        country,
        occupation,
        keySkill,
        profilePicture
    };

    for (const key in filteredInfo) {
        if (filteredInfo[key] === '') {
          delete filteredInfo[key];
        }
    }

    User.findOneAndUpdate({ id: id }, {
        ...filteredInfo
    }, {
        new: true
    }, (err, user) => {
        if (!user) return res.status(404).json({status: 404, error: 'User does not exist.'});
        if (err) return next(err);
        return res.status(204).json(user);
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

    if (validator(req)) {
        return res.status(400).json({status: 400, error: 'Required fields not sent.'});
    }

    const user = await User.findOne({ email: email });

    if (user) {
        return res.status(409).send({error: 'User already exists.'});
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
            return res.status(201).json({status: 201, message: 'New user created.'});
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