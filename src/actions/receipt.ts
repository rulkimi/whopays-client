"use server"

import { getApiClient } from "./api";

export async function fetchReceipts() {
	try {
		const api = await getApiClient();
		const response = await api.get("/receipts/");
		return response.data;
	} catch (error) {
		throw error;
	}
}