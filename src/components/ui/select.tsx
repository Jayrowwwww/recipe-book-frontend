import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export function Select({ className, error, children, ...props }: SelectProps) {
  return (
    <div>
      <select
        className={cn("w-full border bg-white px-3 py-2.5 text-sm text-ink-950 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15", error ? "border-brand-600" : "border-ink-900/15", className)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-brand-700">{error}</p>}
    </div>
  );
}
