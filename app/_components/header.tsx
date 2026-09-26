import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-800">
      <div className="max-w-5xl mx-auto px-8 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-neutral-100 hover:text-white transition-colors"
        >
          Next.js Cache Components
        </Link>
      </div>
    </header>
  );
}
