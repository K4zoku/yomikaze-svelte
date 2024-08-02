import type { JsonPatchEntry } from "$models/JsonPatchDocument";
import type Profile from "$models/Profile";
import http from "./http";
import httpImage from './httpImage';
export interface GetProfileOptions {
    token?: string;
    id?: string | bigint | number;
}
export async function getProfile({ token, id }: GetProfileOptions): Promise<Profile> {
    const url = id ? `/profile/${id}` : '/profile';
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return await http.get(url, { headers }).then(response => response.data);
}

export async function updateProfile(payload: JsonPatchEntry[], token: string): Promise<Profile> {
    const headers = { Authorization: `Bearer ${token}` };
    return await http.patch('/profile', payload, { headers }).then(response => response.data);
}

async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await httpImage.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.url; 
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  export async function changePassword(currentPassword: string, newPassword: string, token: string) {
    try {
      const payload = {
        currentPassword,
        newPassword
      };
  
      const response = await http.put('/profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
 
        return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }