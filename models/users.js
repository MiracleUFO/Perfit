const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = require('./email').schema;

const defaultSchema = {
    type: String,
    required: true,
    trim: true,
    default: ''
};

const userSchema = new Schema({
    firstName: defaultSchema,
    lastName: defaultSchema,
    dob: defaultSchema,
    email: defaultSchema,
    state: defaultSchema,
    country: defaultSchema,
    occupation: defaultSchema,
    keySkill: defaultSchema,
    profilePicture: {
        type: String,
        default: 'https://img.freepik.com/free-photo/happy-african-american-professional-manager-smiling-looking-camera-headshot-portrait_1163-5134.jpg'
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('User', userSchema);