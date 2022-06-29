const express = require('express');
const uploadImage = require('../controllers/cloudinaryUploadController');
const { getUsers, getUser, editExistingUser, addNewUser } = require('../controllers/usersController');

const router = express.Router();

router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.put('/users/:id', editExistingUser);

router.post('/users', addNewUser);

router.post('/upload', uploadImage)

module.exports = router;