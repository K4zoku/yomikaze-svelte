import type Profile from '$models/Profile.js';
import { saveToken } from '$utils/auth-server-utils.js';
import http from '$utils/http.js';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies }) {
    const returnUrl: string|null = url.searchParams.get('returnUrl');
    const t: string|null = url.searchParams.get('token');
    if (!t) {
        throw redirect(302, '/login?error=missing_token');
    }
    const response = await http.get('/profile', {
        headers: {
            Authorization: `Bearer ${t}`
        },
    })
    .catch(error => {
        let res = error.response;
        switch (res.status) {
            case 401:
                throw redirect(302, '/login?error=invalid_token');
            case 403:
                throw redirect(302, '/login?error=forbidden');
            default:
                throw redirect(302, '/login?error=unknown');
        }
    });
    const profile: Profile = response.data;
    saveToken(cookies, t);
    return {
        returnUrl,
        token: t,
        profile
    }
}