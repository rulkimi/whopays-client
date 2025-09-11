"use server"

import { Base64File } from "@/types";
import { getApiClient } from "./api"
import { Buffer } from "buffer";

export async function getFileUrl(filedId: string) {
  try {
    const api = await getApiClient();
    const response = await api.get(`/files/${filedId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export function base64ToFile(base64File: Base64File): Buffer & { name: string; type: string; lastModified: number } {
	const arr = base64File.base64.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1] || '';
	const bstr = Buffer.from(arr[1], 'base64');
	const fileBuffer = Object.assign(bstr, {
		name: base64File.name,
		type: mime,
		lastModified: base64File.lastModified,
	});
	return fileBuffer;
}