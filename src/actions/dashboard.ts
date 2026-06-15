"use server"

import { revalidatePath } from "next/cache";
import { getApiClient } from "./api";
import { getErrorResponse } from "@/lib/error";

export async function refreshDashboardData() {
  console.log("Revalidating /home path...");
  revalidatePath("/home");
  console.log("/home path revalidated.");
}

export const fetchDashboard = async () => {
  try {
    console.log("Fetching dashboard data...");
    const api = await getApiClient();
    console.log("API client obtained, making request to /dashboard...");
    const response = await api.get("/dashboard");
    console.log("Received dashboard response:", response.data);

    return {
      success: true,
      message: "Fetched dashboard data successfully.",
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return getErrorResponse(error);
  }
}