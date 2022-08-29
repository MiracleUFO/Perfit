const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    owner_id: {
        type: Number,
        required: true,
        unique: true
    },
    r_token: {
        type: String,
        required: true,
        trim: true,
        default: '' 
    }
});

module.exports = mongoose.model('ResetPassToken', tokenSchema);