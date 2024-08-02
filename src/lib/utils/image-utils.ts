import { PUBLIC_CDN_BASE_URL } from "$env/static/public";
import axios from "axios";

const httpImage = axios.create({
    baseURL: PUBLIC_CDN_BASE_URL ?? 'https://i.yomikaze.org/'
});

export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('File', file);
    const response = await httpImage.post('/images', formData);
    return response.data.images[0];
}

export async function uploadImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map(file => uploadImage(file)));    
}