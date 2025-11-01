import AuthCard from "../_components/auth-card";
import LoginForm from "../_components/login-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/home");
  }

  return (
    <AuthCard>
      <LoginForm />
    </AuthCard>
  );
}
