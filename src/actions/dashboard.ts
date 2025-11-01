 "use server"

import { revalidatePath } from "next/cache";
import { getApiClient } from "./api";
import { getAccessToken } from "@/lib/session";
import { getErrorResponse } from "@/lib/error";

export async function refreshDashboardData() {
  revalidatePath("/home");
}

export const fetchDashboard = async () => {
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
    return {
      success: true,
      message: "Fetched dashboard data successfully.",
      data: data
    }
  } catch (error) {
    return getErrorResponse(error);
  }
}