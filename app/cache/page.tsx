import Link from "next/link";
import { Suspense } from "react";

// Components with different cache directives

async function Cached() {
  "use cache";
  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-blue-500/30 hover:border-blue-400 transition-all duration-300">
      <h2 className="text-xl font-bold mb-2 text-blue-300">Cached</h2>
      <p className="text-gray-400 mb-4">"use cache"</p>
      <div className="text-xs font-mono bg-gray-900 p-3 rounded-lg text-gray-400">
        Rendered at: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">
        No arguments, cached across all users and requests.
      </p>
    </div>
  );
}

async function RemoteCached() {
  "use cache: remote";
  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-purple-500/30 hover:border-purple-400 transition-all duration-300">
      <h2 className="text-xl font-bold mb-2 text-purple-300">RemoteCached</h2>
      <p className="text-gray-400 mb-4">"use cache: remote"</p>
      <div className="text-xs font-mono bg-gray-900 p-3 rounded-lg text-gray-400">
        Rendered at: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">
        Durable, shared across server instances via remote cache handler.
      </p>
    </div>
  );
}

async function DynamicCached({ randomId }: { randomId: string }) {
  "use cache";
  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-pink-500/30 hover:border-pink-400 transition-all duration-300">
      <h2 className="text-xl font-bold mb-2 text-pink-300">DynamicCached</h2>
      <p className="text-gray-400 mb-4">"use cache" ({randomId})</p>
      <div className="text-xs font-mono bg-gray-900 p-3 rounded-lg text-gray-400">
        Rendered at: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">
        Arguments are part of the cache key. Changes with each randomId.
      </p>
    </div>
  );
}

async function DynamicRemoteCached({ randomId }: { randomId: string }) {
  "use cache: remote";
  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-orange-500/30 hover:border-orange-400 transition-all duration-300">
      <h2 className="text-xl font-bold mb-2 text-orange-300">
        DynamicRemoteCached
      </h2>
      <p className="text-gray-400 mb-4">"use cache: remote" ({randomId})</p>
      <div className="text-xs font-mono bg-gray-900 p-3 rounded-lg text-gray-400">
        Rendered at: {new Date().toLocaleTimeString()}
      </div>
      <p className="mt-4 text-xs text-gray-500 italic">
        Remote shared cache keyed by arguments.
      </p>
    </div>
  );
}

export default async function CacheDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ randomId?: string }>;
}) {
  const { randomId = "default" } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 md:p-12 font-sans flex flex-col items-center">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
          Cache Components Explorer
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience how Next.js 16 handles different caching strategies. The{" "}
          <span className="font-mono bg-gray-800 px-2 py-1 rounded text-pink-400">
            randomId
          </span>
          from the URL is used as a cache key for dynamic components.
        </p>
        <div className="mt-4 inline-block bg-gray-800 px-4 py-2 rounded-full border border-gray-700 text-sm">
          Current randomId:{" "}
          <span className="font-mono text-pink-400 font-bold">{randomId}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl w-full">
        <Suspense fallback={<Skeleton />}>
          <Cached />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <RemoteCached />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <DynamicCached randomId={randomId} />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <DynamicRemoteCached randomId={randomId} />
        </Suspense>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-gray-600 hover:decoration-white"
        >
          ← Back to Home
        </Link>
      </div>

      <footer className="mt-20 text-gray-600 text-xs text-center border-t border-gray-800 pt-8 w-full max-w-5xl">
        Built with Next.js 16.1.6 and Tailwind CSS.
      </footer>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-700 rounded mb-4" />
      <div className="h-4 w-1/2 bg-gray-700 rounded mb-4" />
      <div className="h-12 w-full bg-gray-900 rounded-lg" />
    </div>
  );
}
