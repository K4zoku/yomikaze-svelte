import { JWT_SECRET } from "$env/static/private";
import { error, type Cookies } from "@sveltejs/kit";
import * as jose from 'jose';


export async function isLoggedIn(cookies: Cookies): Promise<boolean> {
    const token = cookies.get('token');
    if (!token) {
        return false;
    }
    return await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
        .then(() => true)
        .catch(() => {
            cookies.delete('token', { path: '/' });
            return false;
        });
}

export async function saveToken(cookies: Cookies, token: string): Promise<void> {
    await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    cookies.set('token', token, { path: '/' });
}

export async function removeToken(cookies: Cookies): Promise<void> {
    cookies.delete('token', { path: '/' });
}

export async function getToken(cookies: Cookies): Promise<string> {
    const token = cookies.get('token');
    if (!token) {
        throw error(401, 'You need to be logged in to access this page');
    }
    return token;
}

export async function hasRoles(token: string, roles: string[]): Promise<boolean> {
    if (!token) {
        return false;
    }
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET)).catch(() => ({ payload: null }));
    if (!payload) {
        return false;
    }
    return checkRoles(payload['roles'] as string | string[], roles);
}

function checkRoles(tokenRoles: string | string[], roles: string[]): boolean {
    if (!tokenRoles) {
        return false;
    }
    if (typeof tokenRoles === 'string') {
        return roles.includes(tokenRoles);
    }
    return tokenRoles.some(role => roles.includes(role));
}