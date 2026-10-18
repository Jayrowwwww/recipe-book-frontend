import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

// Friendly placeholder when a list has nothing to show yet.
export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-ink-800/25 bg-paper-100 px-6 py-14 text-center">
      <div className="mx-auto mb-4 h-10 w-10 bg-ember-300" aria-hidden />
      <h3 className="font-display text-xl font-semibold text-ink-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-950/70">{message}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
