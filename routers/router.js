const express = require('express');
const { getUsers /*, getUser, editExistingUser, addNewUser */ } = require('../controllers/usersController');

const router = express.Router();

router.get('/users', getUsers);

/* router.get('users/:id', getUser);

router.put('users/:id', editExistingUser);

router.post('users', addNewUser); */

module.exports = router;