import { getAuthData } from "$utils/auth-server-utils";

export async function load({ cookies }) {
    return await getAuthData(cookies);
}