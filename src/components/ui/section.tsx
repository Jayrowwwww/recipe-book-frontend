import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  // Shared page width and responsive padding keep every screen aligned.
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8", className)}>
      {children}
    </section>
  );
}