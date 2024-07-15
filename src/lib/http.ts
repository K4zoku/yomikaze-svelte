import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const http = axios.create({
  baseURL: PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/',
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    return status < 500;
  }
});

export default http;
