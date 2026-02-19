import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await searchParams;
  const randomId = Math.random().toString(36).substring(2, 11);
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 text-white font-sans">
      <h1 className="text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
        Next.js Cache Components
      </h1>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full">
        <p className="text-gray-400 mb-6 text-center text-lg">
          Explore the new caching primitives in Next.js 16.
        </p>

        <ul className="space-y-4">
          <li>
            <Link
              href={`/cache?randomId=${randomId}`}
              className="group block p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-500 shadow-lg"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-300 group-hover:text-blue-200">
                  Go to Cache Demo
                </span>
                <span className="text-xs font-mono bg-gray-900 px-2 py-1 rounded text-gray-400">
                  ID: {randomId}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Test different 'use cache' strategies
              </p>
            </Link>
          </li>
        </ul>
      </div>

      <footer className="mt-12 text-gray-500 text-sm">
        Next.js 16.1.6 • Cache Components Enabled
      </footer>
    </div>
  );
}
