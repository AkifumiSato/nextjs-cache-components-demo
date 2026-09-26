import Link from "next/link";

export default function InstantNavigationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-semibold text-neutral-100">
          Instant Navigations
        </h1>
        <Link
          href="/instant-navigations"
          className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          一覧に戻る
        </Link>
      </div>
      {children}
    </div>
  );
}
