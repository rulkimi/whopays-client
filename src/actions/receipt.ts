"use server";

import { getApiClient } from "./api";
import { Receipt } from "@/types";
import { ReceiptSplitsResponse } from "@/types";

export async function fetchReceipts() {
  try {
    const api = await getApiClient();
    const response = await api.get("/receipts");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchReceiptById(receiptId: string): Promise<Receipt> {
  try {
    const api = await getApiClient();
    const response = await api.get(`/receipts/${receiptId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchReceiptSplits(
  receiptId: string
): Promise<ReceiptSplitsResponse> {
  try {
    const api = await getApiClient();
    const response = await api.get(`/receipts/${receiptId}/splits`);
    return response.data as ReceiptSplitsResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function uploadReceipt(file: string, friend_ids: number[]) {
  try {
    const api = await getApiClient();
    const formData = new FormData();

    // Extract base64 data and convert to Blob (like in friend.ts)
    const [header, data] = file.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] || "application/pdf";
    const bytes = atob(data);
    const uint8Array = new Uint8Array(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });

    formData.append("file", blob, "receipt.pdf");

    friend_ids.forEach((id) => {
      formData.append("friend_ids", id.toString());
    });

    const response = await api.post("/receipts", formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading receipt:", error);
    throw error;
  }
}
