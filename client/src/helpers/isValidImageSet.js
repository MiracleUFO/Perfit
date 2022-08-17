import { acceptedImageFormats } from '../constants/acceptedImageFormats';

const isValidImageSet = (url, file) => {
    if ((!url && JSON.stringify(file) === '{}'))
        return true;
    else
        return (
            (url || JSON.stringify(file) !== '{}') &&
            (
                (
                    url && 
                    acceptedImageFormats.includes(url.split('.').pop().split('?')[0])
                ) ||
                (
                    JSON.stringify(file) !== '{}' &&
                    (file?.type === 'image/jpeg' || file?.type === 'image/png')
                )
            )
        );
};

export default isValidImageSet;