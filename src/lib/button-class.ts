import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger" | "accent";

const variants: Record<ButtonVariant, string> = {
  // Solid red = the main action on a screen.
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  // Neutral outline for secondary actions.
  secondary: "border border-ink-900/15 bg-white text-ink-900 hover:bg-paper-100",
  // Bare text button for low-emphasis actions.
  tertiary: "text-ink-700 hover:text-ink-950",
  // Destructive: light red outline so it never competes with primary.
  danger: "border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100",
  // Orange with dark text for high-visibility call-outs.
  accent: "bg-ember-500 text-ink-950 hover:bg-ember-400",
};

// Shared button styling. Lives in lib (not button.tsx) because ESLint's
// react-refresh rule keeps component files exporting only components —
// and because links use buttonClass() so we never nest <button> inside <a>.
// Square corners: the app has no rounded radii by design.
export function buttonClass(variant: ButtonVariant, className?: string) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );
}
