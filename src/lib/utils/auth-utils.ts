import type Login from "$models/Login";
import type Token from "$models/Token";
import type { Cookies } from "@sveltejs/kit";
import http from "./http";
import * as jose from 'jose';

export async function login(data: Login): Promise<Token> {
    return await http('/authentication/login', { 
        data,
        method: 'POST'
    }).then(response => response.data);
}

export async function logout(cookies: Cookies): Promise<void> {
    const token = cookies.get('token');
    if (!token) {
        return;
    }
    cookies.delete('token', { path: '/' });
}