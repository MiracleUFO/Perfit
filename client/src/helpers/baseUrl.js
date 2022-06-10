import isDev from './isDev';

const baseUrl = () => {
    const url = isDev ? '' : '';
    return url;
}

export default baseUrl;