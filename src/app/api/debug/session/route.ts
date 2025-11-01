import { NextRequest, NextResponse } from "next/server";
import { getSession, getAccessToken } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get("session")?.value;
		const refreshTokenCookie = cookieStore.get("refresh_token")?.value;

		const session = await getSession();
		const accessToken = await getAccessToken();

		// Log session information
		console.log("=== SESSION DEBUG ===");
		console.log("Session Cookie Exists:", !!sessionCookie);
		console.log("Refresh Token Cookie Exists:", !!refreshTokenCookie);
		console.log("Session Data:", session ? {
			hasAccessToken: !!session.access_token,
			hasRefreshToken: !!session.refresh_token,
			expiresAt: session.expires_at ? new Date(session.expires_at).toISOString() : null,
			isExpired: session.expires_at ? Date.now() >= session.expires_at : null,
		} : null);
		console.log("Access Token Retrieved:", !!accessToken);
		console.log("===================");

		// Return safe session info (don't expose actual tokens)
		return NextResponse.json({
			hasSession: !!session,
			hasAccessToken: !!accessToken,
			hasRefreshToken: !!session?.refresh_token || !!refreshTokenCookie,
			sessionInfo: session ? {
				hasAccessToken: !!session.access_token,
				hasRefreshToken: !!session.refresh_token,
				expiresAt: session.expires_at ? new Date(session.expires_at).toISOString() : null,
				expiresIn: session.expires_at ? Math.max(0, Math.floor((session.expires_at - Date.now()) / 1000)) : null,
				isExpired: session.expires_at ? Date.now() >= session.expires_at : null,
			} : null,
			cookies: {
				hasSessionCookie: !!sessionCookie,
				hasRefreshTokenCookie: !!refreshTokenCookie,
				sessionCookieLength: sessionCookie?.length || 0,
			},
		});
	} catch (error) {
		console.error("Error in session debug endpoint:", error);
		return NextResponse.json(
			{
				error: "Failed to retrieve session debug info",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

