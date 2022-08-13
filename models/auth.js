const defaultSchema = {
    type: String,
    required: true,
    trim: true,
    default: ''
};

const authSchema = new Schema({
    email: {
        ...defaultSchema,
        unique: true
    },
    password: {
        defaultSchema,
        trim: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Auth', authSchema);