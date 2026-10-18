import { Link } from "react-router";
import { Section } from "@/components/ui/section";
import { buttonClass } from "@/lib/button-class";

// Catch-all route for unknown URLs.
export default function NotFoundPage() {
  return (
    <Section className="py-24 text-center">
      <p className="font-display text-6xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink-950">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-950/70">
        The page you are looking for does not exist, or it has moved.
      </p>
      <Link to="/" className={`${buttonClass("primary")} mt-8`}>Back to home</Link>
    </Section>
  );
}
