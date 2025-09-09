"use server"

import { getApiClient } from "./api"

export async function getFileUrl(filedId: string) {
  try {
    const api = await getApiClient();
    const response = await api.get(`/files/${filedId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

