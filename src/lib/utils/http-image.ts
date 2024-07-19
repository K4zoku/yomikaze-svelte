import axios from 'axios';
import { PUBLIC_CDN_BASE_URL } from '$env/static/public';

const http = axios.create({
  baseURL: PUBLIC_CDN_BASE_URL ?? 'https://i.yomikaze.org/',
  validateStatus: function (status) {
    return status < 500;
  }
});

export default http;
