 "use server"

import { revalidatePath } from "next/cache";
import { getApiClient } from "./api";

export async function refreshDashboardData() {
  revalidatePath("/home");
}

export async function fetchDashboard() {
	const api = await getApiClient();
	const response = await api.get("/dashboard");
	return response.data;
}