import { isLoggedIn } from "$utils/auth-server-utils";
import { redirect } from "@sveltejs/kit";

export async function load({ url, cookies }) {
    const returnUrl:string|null = url.searchParams.get('returnUrl');
    const error:string|null = url.searchParams.get('error');
    if (await isLoggedIn(cookies)) {
        throw redirect(302, returnUrl ?? '/');
    }
    return {
        returnUrl,
        error
    }
}