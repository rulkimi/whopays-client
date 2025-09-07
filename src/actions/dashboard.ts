 "use server"

import { getApiClient } from "./api";

export async function fetchDashboard() {
	try {
		const api = await getApiClient();
		const response = await api.get("/dashboard");
		return response.data;
	} catch (error) {
		throw error;
	}
}