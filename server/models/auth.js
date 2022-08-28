const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultSchema = {
    type: String,
    required: true,
    default: ''
};

const authSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        ...defaultSchema,
        trim: true,
        unique: true
    },
    password: {
        ...defaultSchema,
        trim: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    dob: {
        type: Date,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Auth', authSchema);