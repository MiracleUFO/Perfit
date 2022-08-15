const express = require('express');
const router = express.Router();
const {
    getUsers,
    addNewUser,
    getUser,
    editExistingUser,
} = require('../controllers/usersController');

router.get('/', getUsers);

router.post('/', addNewUser);

router.get('/:id', getUser);

router.put('/:id', editExistingUser);

module.exports = router;