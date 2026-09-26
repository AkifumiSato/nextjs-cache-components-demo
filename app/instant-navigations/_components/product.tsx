import { Suspense } from "react";
import { getPrice, getProductName, getReviews, getStock } from "../_lib/data";

// Views

export function ProductHero({
  id,
  price,
  cachedAt,
  stock,
}: {
  id: string;
  price: number;
  cachedAt: string;
  stock: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
      <div className="aspect-square rounded-lg border border-neutral-800 bg-neutral-800/40 flex items-center justify-center text-4xl text-neutral-600">
        {getProductName(id).charAt(0)}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="text-2xl font-semibold text-neutral-100">
            {getProductName(id)}
          </h2>
          {stock}
        </div>
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

// Fixed size so the tag doesn't shift the layout when it replaces the skeleton
const stockTagClassName =
  "inline-flex h-6 w-20 items-center justify-center rounded border text-xs font-medium";

export function StockTag({ inStock }: { inStock: boolean }) {
  return inStock ? (
    <span
      className={`${stockTagClassName} border-emerald-700/60 bg-emerald-950/40 text-emerald-300`}
    >
      在庫あり
    </span>
  ) : (
    <span
      className={`${stockTagClassName} border-neutral-700 bg-neutral-800/60 text-neutral-400`}
    >
      在庫なし
    </span>
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
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Bar className="h-8 w-64" />
          <StockSkeleton />
        </div>
        <Bar className="mt-3 h-9 w-32" />
        <Bar className="mt-2 h-4 w-48" />
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

export function StockSkeleton() {
  return <Bar className="h-6 w-20" />;
}

export function ProductPageSkeleton() {
  return (
    <div className="space-y-10">
      <ProductHeroSkeleton />
      <ReviewsSkeleton />
    </div>
  );
}

// Loaders

// Keep the price fetch out of the page component. The page component re-runs
// when rendering the dynamic parts at request time, so awaiting the price there
// would delay the Suspense boundaries below on a runtime cache miss.
export async function ProductSummary({ id }: { id: string }) {
  const { price, cachedAt } = await getPrice(id);
  return (
    <ProductHero
      id={id}
      price={price}
      cachedAt={cachedAt}
      stock={
        <Suspense fallback={<StockSkeleton />}>
          <Stock id={id} />
        </Suspense>
      }
    />
  );
}

export async function Reviews({ id }: { id: string }) {
  return <ReviewsView {...(await getReviews(id))} />;
}

async function Stock({ id }: { id: string }) {
  return <StockTag {...(await getStock(id))} />;
}
