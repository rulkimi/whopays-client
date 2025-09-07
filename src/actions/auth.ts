"use server"

import { getApiClient } from "./api";

interface AuthFormData {
  email: string;
  password: string;
}

interface SignUpFormdata extends AuthFormData {
  name: string;
  confirmPassword: string;
}

export async function logIn({ email, password }: AuthFormData) {
	try {
		const api = await getApiClient();
		const formData = new FormData();
		formData.append("username", email);
		formData.append("password", password);

    console.log(process.env.API_URL)


		const response = await api.post("/auth/login", formData);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function signUp({
	email,
	password,
	confirmPassword,
	name
}: SignUpFormdata) {
	if (password !== confirmPassword) {
		throw new Error("Passwords do not match.");
	}
	try {
		const api = await getApiClient();
		const data = {
			email,
			password,
			name,
			is_active: true,
			is_superuser: false
		};

		const response = await api.post("/auth/register", data, {
			headers: {
				"Content-Type": "application/json"
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}