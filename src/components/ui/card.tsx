import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type CardProps = { children: ReactNode; className?: string };
export function Card({ children, className }: CardProps) {
  return <div className={cn("overflow-hidden border border-ink-900/10 bg-white shadow-sm", className)}>{children}</div>;
}
