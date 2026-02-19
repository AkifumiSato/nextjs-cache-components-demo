import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Accessing searchParams makes the page dynamic
  await searchParams;
  const randomId = Math.random().toString(36).substring(2, 11);
  return (
    <div>
      <h1>Next.js Cache Components Demo</h1>
      <ul>
        <li>
          <Link href={`/cache?randomId=${randomId}`}>cache demo (randomId: {randomId})</Link>
        </li>
      </ul>
    </div>
  );
}
