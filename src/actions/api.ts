"use server";

import axios from "axios";
import { getAccessToken } from "@/lib/session";

export async function getApiClient() {
  // Get access token from session (handles refresh automatically)
  const accessToken = await getAccessToken();

  const client = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  });

  // Add response interceptor to handle 401 errors and attempt token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token might be expired, try to get a fresh one
        const newToken = await getAccessToken();
        if (newToken && newToken !== accessToken) {
          // Retry the request with the new token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return client.request(error.config);
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}
