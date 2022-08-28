const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res, next) => {
    const { fileString } = req.body;

    cloudinary.uploader.upload_large(fileString,
        {
            transformation: [
                {fetch_format: 'png', format: 'png'},
                {gravity: 'face', effect: 'trim'},
                {effect: 'bgremoval'},
                {width: 300, height: 300}
            ]
        }
        ,
        (error, result) => {
            if (error) {
                next(error);
                console.log('Cloudinary error:', error);
            }
            else {
                res.status(201).json({status: 201, message: 'New image uploaded.', url: result.url});
            }
    })
    .catch(err => console.log(err));
};

module.exports = uploadImage;