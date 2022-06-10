import isDev from './isDev';

const baseUrl = () => {
    const url = isDev() ? 'http://localhost:8080' : '';
    return url;
}

export default baseUrl;