import Link from "next/link";

export function BackLink() {
  return (
    <Link
      href="/instant-navigations"
      className="mb-4 flex w-fit items-center gap-1 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
    >
      <span aria-hidden>←</span>
      一覧に戻る
    </Link>
  );
}
