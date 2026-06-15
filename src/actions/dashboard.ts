"use server"

import { revalidatePath } from "next/cache";
import { getApiClient } from "./api";
import { getErrorResponse } from "@/lib/error";

export async function refreshDashboardData() {
  revalidatePath("/home");
}

export const fetchDashboard = async () => {
  try {
    const api = await getApiClient();
    const response = await api.get("/dashboard");

    return {
      success: true,
      message: "Fetched dashboard data successfully.",
      data: response.data,
    };
  } catch (error) {
    return getErrorResponse(error);
  }
}