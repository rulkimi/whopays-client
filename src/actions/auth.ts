"use server";

import axios from "axios";
import { setSession } from "@/lib/session";

interface AuthFormData {
  email: string;
  password: string;
}

interface SignUpFormdata extends AuthFormData {
  name: string;
  confirmPassword: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export async function logIn({ email, password }: AuthFormData) {
  try {
    // Create a basic client without auth for login
    const api = axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
    });

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post<LoginResponse>("/auth/login", formData);

    // Calculate expiration time
    const expiresIn = response.data.expires_in || 3600; // Default 1 hour
    const expiresAt = Date.now() + expiresIn * 1000;

    // Save session with JWT encryption
    await setSession({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: expiresAt,
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signUp({
  email,
  password,
  confirmPassword,
  name,
}: SignUpFormdata) {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
  try {
    // Create a basic client without auth for registration
    const api = axios.create({
      baseURL: process.env.API_URL,
      withCredentials: true,
    });

    const data = {
      email,
      password,
      name,
      is_active: true,
      is_superuser: false,
    };

    const response = await api.post("/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

/**
 * Logout and clear session
 */
export async function logOut() {
  const { clearSession } = await import("@/lib/session");
  await clearSession();
  return { success: true };
}
