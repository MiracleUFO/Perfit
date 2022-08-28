const express = require('express');
const router = express.Router();
const { exists, isSTokenValid, getAuthMw } = require('../middlewares/Auth');
const {
    getUsers,
    addNewUser,
    getUser,
    editExistingUser,
} = require('../controllers/usersController');

router.get('/', getUsers);

router.post('/', isSTokenValid, getAuthMw, exists, addNewUser);

router.get('/:id', getUser);

router.put('/:id', isSTokenValid, getAuthMw, exists, editExistingUser);

module.exports = router;