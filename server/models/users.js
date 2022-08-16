const mongoose = require('mongoose');
require('mongoose-type-email');

const Schema = mongoose.Schema;

const defaultSchema = {
    type: String,
    required: true,
    trim: true,
    default: ''
};

const userSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    firstName: defaultSchema,
    lastName: defaultSchema,
    email: {
        ...defaultSchema,
        type: mongoose.SchemaTypes.Email,
        unique: true,
        lowercase: true,
        correctTld: true
    },
    state: defaultSchema,
    country: defaultSchema,
    occupation: defaultSchema,
    keySkill: defaultSchema,
    profilePicture: {
        ...defaultSchema,
        default: 'https://img.freepik.com/free-photo/happy-african-american-professional-manager-smiling-looking-camera-headshot-portrait_1163-5134.jpg'
    },
    created: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('User', userSchema);