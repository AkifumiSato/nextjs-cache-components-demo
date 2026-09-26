import Link from "next/link";
import {
  getPrice,
  getProductName,
  getRecommendations,
  getReviews,
} from "../_lib/data";
import { PendingHint } from "./pending-hint";

// Views

export function ProductHero({
  id,
  price,
  cachedAt,
}: {
  id: string;
  price: number;
  cachedAt: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
      <div className="aspect-square rounded-lg border border-neutral-800 bg-neutral-800/40 flex items-center justify-center text-4xl text-neutral-600">
        {getProductName(id).charAt(0)}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-neutral-100">
          {getProductName(id)}
        </h2>
        <div className="mt-3 text-3xl font-semibold text-neutral-100">
          ¥{price.toLocaleString()}
        </div>
        <div className="mt-2 text-xs font-mono text-neutral-500">
          use cache (hours) ・ 生成時刻: {cachedAt}
        </div>
      </div>
    </div>
  );
}

export function ReviewsView({
  rating,
  count,
  items,
  fetchedAt,
}: {
  rating: number;
  count: number;
  items: { author: string; body: string }[];
  fetchedAt: string;
}) {
  return (
    <Section title="レビュー" fetchedAt={fetchedAt}>
      <div className="text-neutral-100 mb-3">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}{" "}
        <span className="text-sm text-neutral-400">{count} 件</span>
      </div>
      <ul className="divide-y divide-neutral-800">
        {items.map((item) => (
          <li key={item.author} className="py-3 text-sm">
            <div className="text-neutral-500 text-xs mb-1">{item.author}</div>
            <div className="text-neutral-300">{item.body}</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function RecommendationsView({
  next,
  others,
  fetchedAt,
  basePath,
  prefetch,
}: {
  next: { id: string; name: string };
  others: string[];
  fetchedAt: string;
  basePath: string;
  prefetch?: boolean;
}) {
  return (
    <Section title="おすすめ" fetchedAt={fetchedAt}>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <li>
          <Link
            href={`${basePath}/${next.id}`}
            prefetch={prefetch}
            className="flex h-full items-center justify-between gap-2 p-4 rounded-lg border border-neutral-600 bg-neutral-800/60 text-neutral-100 hover:border-neutral-400 hover:bg-neutral-800 transition-colors"
          >
            {next.name} <PendingHint />
          </Link>
        </li>
        {others.map((name) => (
          <li
            key={name}
            className="p-4 rounded-lg border border-neutral-800 text-neutral-500"
          >
            {name}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Section({
  title,
  fetchedAt,
  children,
}: {
  title: string;
  fetchedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 mb-3 border-b border-neutral-800 pb-2">
        <h3 className="font-medium text-neutral-100">{title}</h3>
        <span className="text-xs font-mono text-neutral-500">
          {fetchedAt
            ? `毎リクエスト取得 ・ 取得時刻: ${fetchedAt}`
            : "Streaming 中..."}
        </span>
      </div>
      {children}
    </section>
  );
}

// Skeletons

function Bar({ className }: { className: string }) {
  return (
    <div className={`bg-neutral-800 rounded animate-pulse ${className}`} />
  );
}

export function ProductHeroSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
      <div className="aspect-square rounded-lg bg-neutral-800/40 animate-pulse" />
      <div className="space-y-3">
        <Bar className="h-8 w-64" />
        <Bar className="h-9 w-32" />
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <Section title="レビュー">
      <div className="space-y-3">
        <Bar className="h-4 w-32" />
        <Bar className="h-3 w-3/4" />
        <Bar className="h-3 w-2/3" />
        <Bar className="h-3 w-1/2" />
      </div>
    </Section>
  );
}

export function RecommendationsSkeleton() {
  return (
    <Section title="おすすめ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Bar className="h-14" />
        <Bar className="h-14" />
        <Bar className="h-14" />
      </div>
    </Section>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="space-y-10">
      <ProductHeroSkeleton />
      <ReviewsSkeleton />
      <RecommendationsSkeleton />
    </div>
  );
}

// Loaders

// Keep the price fetch out of the page component. The page component re-runs
// when rendering the dynamic parts at request time, so awaiting the price there
// would delay the Suspense boundaries below on a runtime cache miss.
export async function ProductSummary({ id }: { id: string }) {
  const { price, cachedAt } = await getPrice(id);
  return <ProductHero id={id} price={price} cachedAt={cachedAt} />;
}

export async function Reviews({ id }: { id: string }) {
  return <ReviewsView {...(await getReviews(id))} />;
}

export async function Recommendations({
  id,
  basePath,
  prefetch,
}: {
  id: string;
  basePath: string;
  prefetch?: boolean;
}) {
  return (
    <RecommendationsView
      {...(await getRecommendations(id))}
      basePath={basePath}
      prefetch={prefetch}
    />
  );
}
