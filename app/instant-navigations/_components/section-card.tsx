export function SectionCard({
  title,
  delay,
  renderedAt,
  children,
}: {
  title: string;
  delay: number;
  renderedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-neutral-800/60 rounded-lg border border-neutral-700/60">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-neutral-100">{title}</h3>
        <span className="text-xs font-mono text-neutral-500">
          {delay / 1000}s
        </span>
      </div>
      <div className="text-sm text-neutral-400">{children}</div>
      <div className="mt-3 text-xs font-mono text-neutral-500">
        描画時刻: {renderedAt}
      </div>
    </div>
  );
}

export function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="p-5 bg-neutral-800/30 rounded-lg border border-neutral-800">
      <h3 className="font-medium text-neutral-500 mb-2">{title}</h3>
      <div className="space-y-2 animate-pulse">
        <div className="h-3 w-3/4 bg-neutral-800 rounded" />
        <div className="h-3 w-1/2 bg-neutral-800 rounded" />
      </div>
      <div className="mt-3 text-xs font-mono text-neutral-600">
        Streaming 中...
      </div>
    </div>
  );
}
