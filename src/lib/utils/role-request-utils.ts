import http from '$utils/http'; // Đảm bảo rằng bạn có cấu hình Axios trong `$utils/http`
import type RoleRequest from '$models/RoleRequest'; // Import model RoleRequest
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const ROLE_REQUEST_ENDPOINT = '/roles/requests';


export async function postRoleRequest(reason: string): Promise<RoleRequest> {
    const response = await http.post(ROLE_REQUEST_ENDPOINT, { reason });
    return response.data;
}