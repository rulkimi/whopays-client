import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  console.log("DEBUG: fileId param:", fileId);

  // Get access token from session
  const accessToken = await getAccessToken();

  console.log("DEBUG: accessToken from session:", accessToken);

  // Call FastAPI to get presigned URL
  const apiUrl = `${process.env.API_URL}/files/${fileId}`;
  console.log("DEBUG: Fetching presigned URL from:", apiUrl);

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
    cache: "no-store",
  });

  console.log("DEBUG: FastAPI response status:", res);

  if (!res.ok) {
    console.error(
      "ERROR: Failed to fetch file from FastAPI",
      res.status,
      await res.text()
    );
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }

  // If FastAPI returns the actual file (e.g., image/jpeg), proxy it directly
  const contentType = res.headers.get("content-type") || "";
  if (
    !contentType.includes("application/json") &&
    !contentType.includes("text/plain")
  ) {
    console.log(
      "DEBUG: FastAPI returned binary content, proxying directly. Content-Type:",
      contentType
    );
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Otherwise, expect a JSON or text response containing a presigned URL
  let url: string | undefined;
  try {
    const isText = contentType.includes("text/plain");
    const payload = isText ? await res.text() : await res.json();
    console.log("DEBUG: FastAPI response payload:", payload);

    if (typeof payload === "string") {
      url = payload;
    } else if (
      payload &&
      typeof (payload as { url?: string }).url === "string"
    ) {
      url = (payload as { url: string }).url;
    } else {
      console.error("ERROR: Unexpected FastAPI response format", payload);
      return NextResponse.json(
        { error: "Invalid presigned URL response" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(
      "ERROR: Failed to parse FastAPI response for presigned URL",
      err
    );
    return NextResponse.json(
      { error: "Failed to parse presigned URL" },
      { status: 500 }
    );
  }

  console.log("DEBUG: Presigned file URL:", url);

  if (!url || typeof url !== "string") {
    console.error("ERROR: Presigned URL is undefined or not a string", url);
    return NextResponse.json(
      { error: "Presigned URL missing" },
      { status: 500 }
    );
  }

  // Defensive: If the url is a JSON stringified URL, parse it
  if (url.startsWith('"') && url.endsWith('"')) {
    try {
      url = JSON.parse(url);
    } catch (e) {
      console.error("ERROR: Failed to parse stringified URL", url, e);
      return NextResponse.json(
        { error: "Invalid presigned URL format" },
        { status: 500 }
      );
    }
  }

  // Defensive: If the url is an object, try toString
  if (typeof url !== "string" && url !== undefined && url !== null) {
    if (typeof (url as { toString?: () => string }).toString === "function") {
      try {
        url = (url as { toString: () => string }).toString();
      } catch (e) {
        console.error(
          "ERROR: Could not convert presigned URL to string",
          url,
          e
        );
        return NextResponse.json(
          { error: "Invalid presigned URL type" },
          { status: 500 }
        );
      }
    } else {
      console.error(
        "ERROR: Presigned URL is not a string and has no toString method",
        url
      );
      return NextResponse.json(
        { error: "Invalid presigned URL type" },
        { status: 500 }
      );
    }
  }

  // Fetch actual file from storage using presigned URL
  let fileRes: Response;
  try {
    fileRes = await fetch(url as string);
  } catch (err) {
    console.error("ERROR: Failed to fetch file from storage", err);
    return NextResponse.json(
      { error: "Failed to fetch file data" },
      { status: 500 }
    );
  }

  console.log("DEBUG: Storage fetch status:", fileRes.status);

  if (!fileRes.ok || !fileRes.body) {
    console.error(
      "ERROR: Failed to fetch file data from storage",
      fileRes.status,
      await fileRes.text()
    );
    return NextResponse.json(
      { error: "Failed to fetch file data" },
      { status: 500 }
    );
  }

  console.log("DEBUG: File content-type:", fileRes.headers.get("Content-Type"));

  // Stream file directly back to client
  return new NextResponse(fileRes.body, {
    status: 200,
    headers: {
      "Content-Type":
        fileRes.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
