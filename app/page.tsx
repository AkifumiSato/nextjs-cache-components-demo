import Link from "next/link";
import { connection } from "next/server";

export default async function Page() {
  await connection();

  const randomId = Math.random().toString(36).substring(2, 11);

  return (
    <div>
      <p className="text-neutral-400 mb-8">
        Next.js 16 の新しいキャッシュ機能を試すデモです。
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li>
          <Link
            href={`/cache?randomId=${randomId}`}
            className="block h-full p-5 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg border border-neutral-700/60 hover:border-neutral-500 transition-colors"
          >
            <div className="flex justify-between items-center gap-4">
              <span className="font-medium text-neutral-100">Cache Demo</span>
              <span className="text-xs font-mono bg-neutral-900 px-2 py-1 rounded text-neutral-400">
                ID: {randomId}
              </span>
            </div>
            <p className="text-sm text-neutral-400 mt-2">
              'use cache' の種類ごとのキャッシュ挙動を確認
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/instant-navigations"
            className="block h-full p-5 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg border border-neutral-700/60 hover:border-neutral-500 transition-colors"
          >
            <span className="font-medium text-neutral-100">
              Instant Navigations
            </span>
            <p className="text-sm text-neutral-400 mt-2">
              Suspense と App Shell による即時遷移を確認
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
