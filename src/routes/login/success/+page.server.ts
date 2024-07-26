import { saveToken } from '$utils/auth-server-utils.js';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies }) {
    const returnUrl: string|null = url.searchParams.get('returnUrl');
    const t: string|null = url.searchParams.get('token');
    if (!t) {
        throw redirect(302, '/login?error=missing_token');
    }
    await saveToken(cookies, t).catch(() => {
        throw redirect(302, '/login?error=invalid_token');
    });
    throw redirect(302, returnUrl ?? '/');
}