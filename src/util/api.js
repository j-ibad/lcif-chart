import axios from 'axios';

const api_port = 15010;
const api_baseURL = ((process.env.NODE_ENV || '').trim() === 'development') ? 'http://localhost' : 'https://lcif.ibad.one';

const api = axios.create({
	baseURL: `${api_baseURL}:${api_port}/api/`,
	withCredentials: true
});

export default api;