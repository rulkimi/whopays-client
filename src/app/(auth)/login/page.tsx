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
      <div className="text-center py-6 px-2">
        <h2 className="text-xl font-semibold mb-2">Temporarily Unavailable</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Login is currently disabled for maintenance. We are working on a fix and will be back soon!
        </p>
      </div>
    </AuthCard>
  );
}
