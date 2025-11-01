"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ENCRYPT_KEY = process.env.JWT_ENCRYPT_KEY || SECRET_KEY;

interface SessionData {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

interface EncryptedSession {
  token: string;
  refresh_token?: string;
}

/**
 * Encrypt and sign session data into a JWT
 */
async function encryptSession(data: SessionData): Promise<string> {
  const secret = new TextEncoder().encode(SECRET_KEY);

  const jwt = await new SignJWT({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at || Date.now() + 3600 * 1000, // Default 1 hour
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      Math.floor((data.expires_at || Date.now() + 3600 * 1000) / 1000)
    )
    .sign(secret);

  return jwt;
}

/**
 * Decrypt and verify JWT token
 */
async function decryptSession(token: string): Promise<SessionData | null> {
  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    return {
      access_token: payload.access_token as string,
      refresh_token: payload.refresh_token as string | undefined,
      expires_at: payload.expires_at as number | undefined,
    };
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  return await decryptSession(sessionCookie);
}

/**
 * Set session in cookie
 */
export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  const encryptedToken = await encryptSession(data);

  // Set cookie with secure options
  cookieStore.set("session", encryptedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Store refresh token separately if provided
  if (data.refresh_token) {
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
}

/**
 * Clear session cookies
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("refresh_token");
}

/**
 * Get refresh token from cookie
 */
async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value || null;
}

/**
 * Get access token from session, refreshing if needed
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();

  if (!session) {
    // Try to refresh using stored refresh token
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      return await refreshAccessToken(refreshToken);
    }
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  const expiresAt = session.expires_at || Date.now() + 3600 * 1000;
  const isExpired = Date.now() >= expiresAt - 5 * 60 * 1000;

  if (isExpired) {
    // Attempt to refresh the token
    const refreshToken = session.refresh_token || (await getRefreshToken());
    if (refreshToken) {
      const newToken = await refreshAccessToken(refreshToken);
      return newToken;
    }
    // Token expired and no refresh token, clear session
    await clearSession();
    return null;
  }

  return session.access_token;
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  try {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      console.error("API_URL not configured");
      return null;
    }

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token:", response.status);
      await clearSession();
      return null;
    }

    const data = await response.json();

    if (data.access_token) {
      // Calculate expiration time
      const expiresIn = data.expires_in || 3600; // Default 1 hour
      const expiresAt = Date.now() + expiresIn * 1000;

      // Update session with new token
      await setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken,
        expires_at: expiresAt,
      });

      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    await clearSession();
    return null;
  }
}

/**
 * Refresh access token using stored refresh token
 */
export async function refreshSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  return await refreshAccessToken(refreshToken);
}
