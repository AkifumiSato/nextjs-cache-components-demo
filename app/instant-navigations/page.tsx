import Link from "next/link";

export default function InstantNavigationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-100 mb-2">
        Instant Navigations
      </h1>
      <p className="text-neutral-400">Coming soon.</p>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
