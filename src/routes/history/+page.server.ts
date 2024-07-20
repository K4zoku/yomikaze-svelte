import http from '$utils/http';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    http.defaults.headers.authorization= 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MjY1NjY5MjkyNzY1NTkzNiIsImlhdCI6MTcyMTM4OTkwNSwic3ViIjoiNjg2MzQxOTM0NjIwNjMxMDQiLCJuYW1lIjoiYWRtaW5pc3RyYXRvciIsImVtYWlsIjoiYWRtaW5pc3RyYXRvckB5b21pa2F6ZS5vcmciLCJzaWQiOiJFVDVQRlQ1T0hRRTVYUFQ1NExYREZRVFpPSlVKTUtONiIsInJvbGVzIjpbIlN1cGVyIiwiQWRtaW5pc3RyYXRvciJdfQ.f5G67sGwGy1SpfyW5RB1MxNYxkKEyRTW8bCoKPRX00c'
    return {
        historyEntries: http.get('/history')
    };
}) satisfies PageServerLoad;