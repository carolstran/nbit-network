import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'oatmeal',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
