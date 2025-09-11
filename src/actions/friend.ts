"use server"

import { getApiClient } from "./api";

export async function createFriend(
  name: string,
  base64File: string
) {
  try {
    const api = await getApiClient();
    const formData = new FormData();

    // Extract base64 data and convert to Blob
    const [header, data] = base64File.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bytes = atob(data);
    const uint8Array = new Uint8Array(bytes.length);
    
    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }
    
    const blob = new Blob([uint8Array], { type: mimeType });

    formData.append("name", name);
    formData.append("photo", blob, "photo.jpg");

    const response = await api.post("/friends", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating friend:", error);
    throw error;
  }
}
