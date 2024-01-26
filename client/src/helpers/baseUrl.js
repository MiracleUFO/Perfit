import isDev from './isDev';

const baseUrl = () => {
    const url = isDev() ? 'http://localhost:8080' : process.env.BASE_URL;
    return url;
};

export default baseUrl;