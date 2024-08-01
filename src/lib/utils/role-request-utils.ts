import http from '$utils/http'; // Đảm bảo rằng bạn có cấu hình Axios trong `$utils/http`
import type RoleRequest from '$models/RoleRequest'; // Import model RoleRequest
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const BASE_URL = PUBLIC_API_BASE_URL ?? 'https://api.yomikaze.org/';
const ROLE_REQUEST_ENDPOINT = '/roles/requests';


export async function postRoleRequest(reason: string): Promise<RoleRequest> {
    const response = await http.post(ROLE_REQUEST_ENDPOINT, { reason });
    return response.data;
}

export async function getRoleRequests(): Promise<RoleRequest[]> {
    try {
        const response = await http.get(ROLE_REQUEST_ENDPOINT);
        return response.data.results; 
    } catch (error) {
        console.error('Error fetching role requests:', error);
        throw error;
    }
}

export async function approveRoleRequest(id: string): Promise<void> {
    try {
        await http.put(`${ROLE_REQUEST_ENDPOINT}/${id}/approve`);
    } catch (error) {
        console.error('Error approving role request:', error);
        throw error; 
    }
}

export async function rejectRoleRequest(id: string): Promise<void> {
    await http.put(`${ROLE_REQUEST_ENDPOINT}/${id}/reject`);
}