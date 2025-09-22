import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ receiptId: string }> }
) {
  const { receiptId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const apiUrl = `${process.env.API_URL}/receipts/${receiptId}/splits`;

  let res: Response;
  try {
    res = await fetch(apiUrl, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error("ERROR: Failed to contact backend for receipt splits", err);
    return NextResponse.json(
      { error: "Failed to fetch splits" },
      { status: 500 }
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("ERROR: Backend returned error for splits", res.status, text);
    return NextResponse.json(
      { error: "Failed to fetch splits" },
      { status: res.status }
    );
  }

  try {
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("ERROR: Failed to parse backend splits response", err);
    return NextResponse.json(
      { error: "Invalid splits response" },
      { status: 500 }
    );
  }
}
