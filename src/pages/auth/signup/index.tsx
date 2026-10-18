import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/features/auth/signup-form";

export default function SignupPage() {
  return (
    <Card className="border-ink-900/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8 [&_input]:border-ink-900/15 [&_input]:bg-white [&_input]:py-3 [&_input]:outline-none [&_input]:focus:border-brand-600 [&_input]:focus:ring-2 [&_input]:focus:ring-brand-600/15">
      <AuthFormHeader title="Create your account" description="A little inspiration for your everyday cooking." />

      <SignupForm />

      <Link className="mt-6 block text-center text-sm font-medium text-brand-600 underline underline-offset-4" to={"/auth/login"}>
        Already have an account? Sign in
      </Link>
    </Card>
  );
}