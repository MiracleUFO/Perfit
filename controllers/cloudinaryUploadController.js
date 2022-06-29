const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res, next) => {
    const { fileString } = req.body;

    cloudinary.uploader.upload(fileString, (error, result) => {
        res.status(201).json({status: 201, message: 'New image uploaded.', url: result.url});
        if (error) {
            next(err);
        }
    });
};

module.exports = uploadImage;