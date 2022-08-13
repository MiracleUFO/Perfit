const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res, next) => {
    const { fileString } = req.body;

    cloudinary.uploader.upload_large(fileString,
        /*{
            width: 100,
            height: 100,
            aspectRatio: '1.0',
            format: 'png',
            gravity: 'face',
            crop: 'fill',
            effect: 'bgremoval',
            background: '#EFECEC'
        },*/
        {transformation: [
            {format: 'webp'},
            {gravity: 'auto:subject'},
            {width: 300, height: 300, crop: 'thumb', aspect_ratio: '1.0'},
            {effect: 'bgremoval:screen'},
            {background: '#EFECEC'},
            {height: 100, width: 100, crop: 'lfill', aspect_ratio: '1.0'},
            {effect: 'trim', quality: 100},
        ]}
        ,
        (error, result) => {
            if (error) {
                next(error);
                console.log(error);
            }
            else {
                res.status(201).json({status: 201, message: 'New image uploaded.', url: result.url});
            }
    });
};

module.exports = uploadImage;