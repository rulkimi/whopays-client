"use server";

import { getApiClient } from "./api";
import { Receipt } from "@/types";
import { ReceiptSplitsResponse } from "@/types";

export async function fetchReceipts() {
  const api = await getApiClient();
  const response = await api.get("/receipts");
  return response.data;
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
    console.log("Uploading receipt. File (base64) length:", file.length);
    console.log("Friend IDs:", friend_ids);

    const api = await getApiClient();
    const formData = new FormData();

    // Extract base64 data and convert to Blob (like in friend.ts)
    const [header, data] = file.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] || "application/pdf";
    console.log("Detected MIME type:", mimeType);

    const bytes = atob(data);
    console.log("Decoded base64 to bytes. Bytes length:", bytes.length);

    const uint8Array = new Uint8Array(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    console.log("Created Blob. Blob size:", blob.size);

    formData.append("file", blob, "receipt.pdf");

    friend_ids.forEach((id) => {
      console.log("Appending friend_id to formData:", id);
      formData.append("friend_ids", id.toString());
    });

    console.log("Posting formData to /receipts");
    const response = await api.post("/receipts", formData);
    console.log("DEBUG: Upload receipt response:", response);
    return response.data;
  } catch (error) {
    console.error("Error uploading receipt:", error);
    throw error;
  }
}

export async function deleteReceipt(receiptId: number) {
	try {
		const api = await getApiClient();
		const response = await api.delete(`/receipts/${receiptId}`);
		return response.data;
	} catch (error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as { response?: unknown }).response === "object" &&
			(error as { response?: { status?: unknown } }).response !== null
		) {
			const response = (error as { response: { status?: number; data?: { detail?: string } } }).response;
			if (response.status === 404) {
				throw new Error(
					response.data && response.data.detail
						? response.data.detail
						: "Receipt not found."
				);
			} else if (response.status === 400) {
				throw new Error(
					response.data && response.data.detail
						? response.data.detail
						: "Failed to delete receipt."
				);
			}
		}
		console.error("Error deleting receipt:", error);
		throw error;
	}
}