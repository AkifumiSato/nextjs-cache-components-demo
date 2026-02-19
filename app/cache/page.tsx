import { Suspense } from "react";

// Components with different cache directives

async function Cached() {
  "use cache";
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">Cached</h2>
      <p>use cache (no args)</p>
      <p className="text-sm text-gray-500">Rendered at: {new Date().toISOString()}</p>
    </div>
  );
}

async function RemoteCached() {
  "use cache: remote";
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">RemoteCached</h2>
      <p>use cache: remote (no args)</p>
      <p className="text-sm text-gray-500">Rendered at: {new Date().toISOString()}</p>
    </div>
  );
}

async function DynamicCached({ randomId }: { randomId: string }) {
  "use cache";
  // randomId is part of the cache key because it's an argument to the cached function scope
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">DynamicCached</h2>
      <p>use cache ({randomId})</p>
      <p className="text-sm text-gray-500">Rendered at: {new Date().toISOString()}</p>
    </div>
  );
}

async function DynamicRemoteCached({ randomId }: { randomId: string }) {
  "use cache: remote";
  // randomId is part of the cache key because it's an argument to the cached function scope
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">DynamicRemoteCached</h2>
      <p>use cache: remote ({randomId})</p>
      <p className="text-sm text-gray-500">Rendered at: {new Date().toISOString()}</p>
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
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Cache Components Demo</h1>
      <p>Random ID from URL: <span className="font-mono bg-gray-100 p-1">{randomId}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={<div>Loading Cached...</div>}>
          <Cached />
        </Suspense>

        <Suspense fallback={<div>Loading RemoteCached...</div>}>
          <RemoteCached />
        </Suspense>

        <Suspense fallback={<div>Loading DynamicCached...</div>}>
          <DynamicCached randomId={randomId} />
        </Suspense>

        <Suspense fallback={<div>Loading DynamicRemoteCached...</div>}>
          <DynamicRemoteCached randomId={randomId} />
        </Suspense>
      </div>

      <div className="mt-8">
        <a href="/" className="text-blue-500 underline">Back to Home</a>
      </div>
    </div>
  );
}
