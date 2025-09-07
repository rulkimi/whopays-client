"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function getApiClient() {
  // Read cookies from the incoming request
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  console.log(accessToken)

  const client = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  });

  return client;
}
