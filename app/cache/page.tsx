import Link from "next/link";
import { Suspense } from "react";

// Components with different cache directives

async function Cached() {
  "use cache";
  return (
    <div className="p-6 bg-neutral-800/60 rounded-lg border border-neutral-700/60">
      <h2 className="text-lg font-semibold mb-1 text-blue-300">Cached</h2>
      <p className="text-neutral-400 font-mono text-sm mb-4">"use cache"</p>
      <div className="text-xs font-mono bg-neutral-900 p-3 rounded text-neutral-400">
        描画時刻: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        引数なし。全ユーザー・全リクエストで共有されます。
      </p>
    </div>
  );
}

async function RemoteCached() {
  "use cache: remote";
  return (
    <div className="p-6 bg-neutral-800/60 rounded-lg border border-neutral-700/60">
      <h2 className="text-lg font-semibold mb-1 text-purple-300">
        RemoteCached
      </h2>
      <p className="text-neutral-400 font-mono text-sm mb-4">
        "use cache: remote"
      </p>
      <div className="text-xs font-mono bg-neutral-900 p-3 rounded text-neutral-400">
        描画時刻: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        remote cache handler を通じて、サーバーインスタンス間で共有されます。
      </p>
    </div>
  );
}

async function DynamicCached({ randomId }: { randomId: string }) {
  "use cache";
  return (
    <div className="p-6 bg-neutral-800/60 rounded-lg border border-neutral-700/60">
      <h2 className="text-lg font-semibold mb-1 text-pink-300">
        DynamicCached
      </h2>
      <p className="text-neutral-400 font-mono text-sm mb-4">
        "use cache" ({randomId})
      </p>
      <div className="text-xs font-mono bg-neutral-900 p-3 rounded text-neutral-400">
        描画時刻: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        引数が cache key に含まれるため、randomId
        ごとに別のキャッシュになります。
      </p>
    </div>
  );
}

async function DynamicRemoteCached({ randomId }: { randomId: string }) {
  "use cache: remote";
  return (
    <div className="p-6 bg-neutral-800/60 rounded-lg border border-neutral-700/60">
      <h2 className="text-lg font-semibold mb-1 text-orange-300">
        DynamicRemoteCached
      </h2>
      <p className="text-neutral-400 font-mono text-sm mb-4">
        "use cache: remote" ({randomId})
      </p>
      <div className="text-xs font-mono bg-neutral-900 p-3 rounded text-neutral-400">
        描画時刻: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        引数を cache key とする remote cache です。
      </p>
    </div>
  );
}

async function CurrentRandomId({
  searchParams,
}: {
  searchParams: Promise<{ randomId?: string }>;
}) {
  const { randomId = "default" } = await searchParams;
  return <span className="font-mono text-neutral-100">{randomId}</span>;
}

async function DynamicCards({
  searchParams,
}: {
  searchParams: Promise<{ randomId?: string }>;
}) {
  const { randomId = "default" } = await searchParams;
  return (
    <>
      <DynamicCached randomId={randomId} />

      <DynamicRemoteCached randomId={randomId} />
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="p-6 h-52 bg-neutral-800/30 rounded-lg border border-neutral-800 animate-pulse" />
  );
}

export default function CacheDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ randomId?: string }>;
}) {
  return (
    <div>
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-neutral-100 mb-3">
          Cache Components Explorer
        </h1>
        <p className="text-neutral-400 max-w-2xl">
          Next.js 16 のキャッシュ戦略ごとの挙動を確認できます。URL の{" "}
          <span className="font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">
            randomId
          </span>{" "}
          は、動的なコンポーネントの cache key として使われます。
        </p>
        <div className="mt-4 inline-block bg-neutral-800/60 px-3 py-1.5 rounded border border-neutral-700/60 text-sm text-neutral-400">
          現在の randomId:{" "}
          <Suspense
            fallback={<span className="font-mono text-neutral-600">…</span>}
          >
            <CurrentRandomId searchParams={searchParams} />
          </Suspense>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Cached />

        <RemoteCached />

        <Suspense
          fallback={
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          }
        >
          <DynamicCards searchParams={searchParams} />
        </Suspense>
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          ← トップに戻る
        </Link>
      </div>
    </div>
  );
}
