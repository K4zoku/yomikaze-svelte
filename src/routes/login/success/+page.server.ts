import { invalidateAll } from '$app/navigation';
import { saveToken } from '$utils/auth-server-utils.js';
import { redirect } from '@sveltejs/kit';

export async function load({ url, cookies }) {
    const returnUrl: string|null = url.searchParams.get('returnUrl');
    const t: string|null = url.searchParams.get('token');
    if (!t) {
        invalidateAll();
        throw redirect(302, '/login?error=missing_token');
    }
    await saveToken(cookies, t).catch(() => {
        invalidateAll();
        throw redirect(302, '/login?error=invalid_token');
    });
    invalidateAll();
    throw redirect(302, returnUrl ?? '/');
}