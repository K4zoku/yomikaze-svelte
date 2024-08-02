import { JWT_SECRET } from "$env/static/private";
import { error, type Cookies } from "@sveltejs/kit";
import * as jose from 'jose';
import { getProfile } from "./profile-utils";
import type Profile from "$models/Profile";

const SECRET = new TextEncoder().encode(JWT_SECRET);

export async function isLoggedIn(cookies: Cookies): Promise<boolean> {
    const token = cookies.get('token');
    if (!token) {
        return false;
    }
    const result = await jose.jwtVerify(token, SECRET)
        .then(() => true)
        .catch(() => {
            removeToken(cookies);
            return false;
        });
    return result;
}

export async function verifyToken(token: string): Promise<void> {
    await jose.jwtVerify(token, SECRET);
}

export async function saveToken(cookies: Cookies, token: string): Promise<void> {
    await jose.jwtVerify(token, SECRET);
    cookies.set('token', token, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
}

export function removeToken(cookies: Cookies) {
    cookies.delete('token', { path: '/' });
}

export async function getToken(cookies: Cookies): Promise<string> {
    const token = cookies.get('token');
    if (!token) {
        throw error(401, 'You need to be logged in to access this page');
    }
    return token;
}

export async function getAndVerifyToken(cookies: Cookies): Promise<string> {
    const token = await getToken(cookies);
    await verifyToken(token)
        .catch(() => {
            removeToken(cookies);
            throw error(401, 'Your session has expired. Please log in again.');
        });
    return token;
}

export async function hasRoles(token: string, roles: string[]): Promise<boolean> {
    if (!token) {
        return false;
    }
    const { payload } = await jose.jwtVerify(token, SECRET).catch(() => ({ payload: null }));
    if (!payload) {
        return false;
    }
    return checkRoles(payload['roles'] as string | string[], roles);
}

export async function getUserId(token: string): Promise<string> {
    const { payload } = await jose.jwtVerify(token, SECRET);
    const userId = payload.sub;
    if (!userId) {
        throw error(401, 'Invalid token');
    }
    return userId;
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

export async function getAuthData(cookies: Cookies): Promise<{ token: string | null, user: Profile | null, isAuthenticated: boolean }> {
    const token = await getToken(cookies).catch(() => null);
    if (!token) {
        return {
            token: null,
            user: null,
            isAuthenticated: false
        };
    }
    const user = await getProfile({ token }).catch(() => null);
    return {
        token,
        user,
        isAuthenticated: !!user
    };
}