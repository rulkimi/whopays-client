"use server"

import { base64ToFile } from "@/lib/utils";
import { getApiClient } from "./api";
import { Base64File } from "@/types";

export async function fetchReceipts() {
	try {
		const api = await getApiClient();
		const response = await api.get("/receipts");
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function uploadReceipt(
	file: Base64File,
	friend_ids: number[]
) {
	try {
		const api = await getApiClient();
		const formData = new FormData();

		const fileData = base64ToFile(file);

		formData.append("file", fileData);

		friend_ids.forEach((id) => {
			formData.append("friend_ids", id.toString());
		});

		const response = await api.post("/receipts", formData);
		return response.data;
	} catch (error) {
		console.error("Error uploading receipt:", error);
		throw error;
	}
}

