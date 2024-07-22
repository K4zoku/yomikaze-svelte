import type Profile from "$models/Profile";
import http from "./http";
export interface GetProfileOptions {
    token?: string;
    id?: string | bigint | number;
}
export async function getProfile({token, id}: GetProfileOptions): Promise<Profile> {
    const url = id ? `/profile/${id}` : '/profile';
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return await http.get(url, { headers }).then(response => response.data);
}