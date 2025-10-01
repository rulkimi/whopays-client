import AuthCard from "../_components/auth-card";
import LoginForm from "../_components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;

	if (accessToken) {
		redirect("/home");
	}

	return (
		<AuthCard>
			<LoginForm />
		</AuthCard>
	);
}