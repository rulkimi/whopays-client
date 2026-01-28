 "use server"

import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/session";
import { getErrorResponse } from "@/lib/error";
import { DashboardResponse } from "@/types/api-responses";

export async function refreshDashboardData() {
  revalidatePath("/home");
}

export const fetchDashboard = async (): Promise<DashboardResponse> => {
	// const api = await getApiClient();
  const token = await getAccessToken();
  const url = `${process.env.API_URL}/dashboard`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      return getErrorResponse(data.message);
    }

    return data;
  } catch (error) {
    return getErrorResponse(error);
  }
}