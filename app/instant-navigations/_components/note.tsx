export function Note({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-neutral-800 bg-neutral-900/40">
      <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-4 px-4 py-3 text-sm text-neutral-200 hover:text-neutral-100 [&::-webkit-details-marker]:hidden">
        {summary}
        <span className="text-neutral-500 transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-neutral-400">
        {children}
      </div>
    </details>
  );
}
