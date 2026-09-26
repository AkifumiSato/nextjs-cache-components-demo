const tags = {
  "prefetch-true": {
    label: "Instant + prefetch={true}",
    className: "border-emerald-700/60 bg-emerald-950/40 text-emerald-300",
  },
  "app-shell": {
    label: "Instant + prefetch={undefined}",
    className: "border-sky-700/60 bg-sky-950/40 text-sky-300",
  },
  "no-prefetch": {
    label: "Instant + prefetch={false}",
    className: "border-violet-700/60 bg-violet-950/40 text-violet-300",
  },
  blocking: {
    label: "export const instant = false",
    className: "border-amber-700/60 bg-amber-950/40 text-amber-300",
  },
};

export function RouteTag({ variant }: { variant: keyof typeof tags }) {
  const { label, className } = tags[variant];
  return (
    <span
      className={`inline-block text-xs font-medium font-mono px-2 py-1 rounded border ${className}`}
    >
      {label}
    </span>
  );
}
