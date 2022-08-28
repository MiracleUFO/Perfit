import axios from 'axios';
import baseUrl from './baseUrl';
import isValidImageUrl from './isValidImageUrl';

const createImageUrl = async (image) => {
    const url = baseUrl();

    if (typeof image !== 'string') {
        const reader = new FileReader();
        reader.readAsDataURL(image);

        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                axios.post(`${url}/api/cloudinary/upload`, { fileString: reader.result })
                    .then(res => resolve(res.data.url))
                    .catch(err => reject(err));
            };
        });
    } else return await isValidImageUrl(image);
};

export default createImageUrl;