import { getProfile } from '$utils/profile-utils.js';

export async function load({ params }) {
    const { id } = params;
    const profile = await getProfile({id});
    return { profile };
}