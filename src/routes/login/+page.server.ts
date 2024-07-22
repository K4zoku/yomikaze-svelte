import { redirect } from "@sveltejs/kit";

export async function load({url}) {
    const returnUrl:string|null = url.searchParams.get('returnUrl');
    const error:string|null = url.searchParams.get('error');
    return {
        returnUrl,
        error
    }
}