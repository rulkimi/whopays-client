import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Node runtime WS-to-SSE proxy: connects to backend WS with Authorization header and streams messages to client via SSE.
export async function GET(req: NextRequest) {
  const path = req.nextUrl?.pathname || "";
  const parts = path.split("/");
  const jobId = parts[parts.length - 1] || "";

  const backendBase = process.env.API_URL;
  if (!backendBase) {
    return NextResponse.json({ error: "API_URL not configured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let backendWsUrl: string;
  try {
    const u = new URL(backendBase);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    u.pathname = `/jobs/ws/${jobId}`;
    u.search = "";
    if (accessToken) {
      u.searchParams.set("token", `Bearer ${accessToken}`);
    }
    u.hash = "";
    backendWsUrl = u.toString();
  } catch (err) {
    console.error("Failed to compose WS URL:", err);
    return NextResponse.json({ error: "Invalid API_URL" }, { status: 500 });
  }

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Dynamically import 'ws' to avoid type resolution issues at build time
  const WebSocketLib = (await import("ws")).default as any;
  const ws: any = new WebSocketLib(backendWsUrl, { headers });

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();

      function sendEvent(data: string) {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      ws.on("open", () => {
        sendEvent(JSON.stringify({ type: "open" }));
      });

      ws.on("message", (message: any) => {
        try {
          const str = typeof message === "string" ? message : message.toString();
          // Print raw WS message from backend
          try { console.log(`[jobs/ws ${jobId}]`, str); } catch {}
          sendEvent(str);
        } catch {
          sendEvent(JSON.stringify({ type: "error", message: "decode_error" }));
        }
      });

      ws.on("error", (err: any) => {
        sendEvent(JSON.stringify({ type: "error", message: String(err) }));
      });

      ws.on("close", (code: any, reason: any) => {
        sendEvent(JSON.stringify({ type: "close", code, reason: reason.toString() }));
        controller.close();
      });
    },
    cancel() {
      try { ws.close(); } catch {}
    },
  });

  return new NextResponse(stream as any, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}


