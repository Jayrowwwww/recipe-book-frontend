import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <Card className="border-ink-900/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8 [&_input]:border-ink-900/15 [&_input]:bg-white [&_input]:py-3 [&_input]:outline-none [&_input]:focus:border-brand-600 [&_input]:focus:ring-2 [&_input]:focus:ring-brand-600/15">
      {/* The page owns its presentation; the feature handles form state and submission. */}
      <AuthFormHeader title="Welcome back" description="Sign in to find your next favorite meal." />

      <LoginForm />

      <Link className="mt-6 block text-center text-sm font-medium text-brand-600 underline underline-offset-4" to={"/auth/signup"}>
        New here? Create an account
      </Link>
    </Card>
  );
}
