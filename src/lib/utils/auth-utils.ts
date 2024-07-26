import type Login from "$models/Login";
import type Token from "$models/Token";
import type { Cookies } from "@sveltejs/kit";
import http from "./http";
import * as jose from 'jose';
import type Register from "$models/Register";

export async function login(data: Login): Promise<Token> {
    return await http('/authentication/login', { 
        data,
        method: 'POST'
    }).then(response => response.data);
}

export async function register(data: Register): Promise<Token> {
    return await http('/authentication/register', { 
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