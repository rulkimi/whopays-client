import { NextRequest, NextResponse } from "next/server";
import { getApiClient } from "@/actions/api";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const friendIds = formData
      .getAll("friend_ids")
      .map((id) => parseInt(id.toString()));

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Blob and create new FormData for backend API
    const api = await getApiClient();
    const uploadFormData = new FormData();

    uploadFormData.append("file", file);
    friendIds.forEach((id) => {
      uploadFormData.append("friend_ids", id.toString());
    });

    const response = await api.post("/receipts", uploadFormData);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error uploading receipt:", error);
    return NextResponse.json(
      { error: "Failed to upload receipt" },
      { status: 500 }
    );
  }
}
