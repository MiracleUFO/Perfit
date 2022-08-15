import isDev from './isDev';

const baseUrl = () => {
    const url = isDev() ? 'http://localhost:8080' : '';
    console.log(url);
    return url;
};

export default baseUrl;