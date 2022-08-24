const express = require('express');
const router = express.Router();
const exists = require('../middlewares/Auth');
const {
    getUsers,
    addNewUser,
    getUser,
    editExistingUser,
} = require('../controllers/usersController');

router.get('/', getUsers);

router.post('/', exists, addNewUser);

router.get('/:id', getUser);

router.put('/:id', editExistingUser);

module.exports = router;