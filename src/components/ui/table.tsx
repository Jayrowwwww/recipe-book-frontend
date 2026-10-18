import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type TableProps = { children: ReactNode; className?: string };
export function Table({ children, className }: TableProps) {
  return <div className="overflow-x-auto border border-ink-900/10 bg-white"><table className={cn("w-full text-left text-sm [&_th]:px-5 [&_th]:py-4 [&_th]:font-semibold [&_td]:px-5 [&_td]:py-4 [&_thead]:bg-paper-100 [&_tbody_tr]:border-t [&_tbody_tr]:border-ink-900/10", className)}>{children}</table></div>;
}
