import AuthCard from "../_components/auth-card";
import SignupForm from "../_components/signup-form";

export default function SignupPage() {
  return (
    <AuthCard>
      <div className="text-center py-6 px-2">
        <h2 className="text-xl font-semibold mb-2">Temporarily Unavailable</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign up is currently disabled for maintenance. We are working on a fix and will be back soon!
        </p>
      </div>
    </AuthCard>
  )
}