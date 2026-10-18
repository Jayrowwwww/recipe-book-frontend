import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea className={cn("w-full border bg-white px-3 py-2.5 text-sm text-ink-950 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15", error ? "border-brand-600" : "border-ink-900/15", className)} {...props} />
      {error && <p className="mt-1 text-xs text-brand-700">{error}</p>}
    </div>
  );
}
