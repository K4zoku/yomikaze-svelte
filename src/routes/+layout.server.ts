import { getAuthData } from "$utils/auth-server-utils";

export async function load({ cookies }) {
    const authData = await getAuthData(cookies);
    return {
        ...authData
    }
}