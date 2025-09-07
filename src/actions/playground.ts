"use server";

import { getApiClient } from "./api";

export async function getGeminiResponse() {
  const api = await getApiClient();
  const res = await api.post("/ai/gemini");
  return res.data;
}
