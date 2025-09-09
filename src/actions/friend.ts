"use server"

import { base64ToFile } from "@/lib/utils";
import { getApiClient } from "./api";
import { Base64File } from "@/types";

export async function createFriend(
	name: string,
	file: Base64File
) {
	try {
		const api = await getApiClient();
		const formData = new FormData();

		const fileData = base64ToFile(file);

		formData.append("name", name);
		formData.append("photo", fileData);

		const response = await api.post("/friends", formData);
		return response.data;
	} catch (error) {
		console.error("Error creating friend:", error);
		throw error;
	}
}
