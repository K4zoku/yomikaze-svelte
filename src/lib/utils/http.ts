import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MjYzNjAwNjQwMjIyNDEyOCIsImlhdCI6MTcyMTM4NDk3Mywic3ViIjoiNjg2MzQxOTM0NjIwNjMxMDQiLCJuYW1lIjoiYWRtaW5pc3RyYXRvciIsImVtYWlsIjoiYWRtaW5pc3RyYXRvckB5b21pa2F6ZS5vcmciLCJzaWQiOiJFVDVQRlQ1T0hRRTVYUFQ1NExYREZRVFpPSlVKTUtONiIsInJvbGVzIjpbIlN1cGVyIiwiQWRtaW5pc3RyYXRvciJdfQ.q28O8trqc-nzpXlFHrHxoaYGg4xVWZ4Dijbd8Cgiedw';
const http = axios.create({
  baseURL: PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  validateStatus: function (status) {
    return status < 500;
  }
});

export default http;
