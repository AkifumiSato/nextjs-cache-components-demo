import { connection } from "next/server";
import { Suspense } from "react";
import {
  ProductHero,
  ProductHeroSkeleton,
  RecommendationsSection,
  RecommendationsSkeleton,
  RecommendationsView,
  StockSkeleton,
  StockView,
} from "../../_components/product";
import {
  getProduct,
  getRecommendations,
  getStockCached,
} from "../../_lib/data";

export const instant = true;

// No generateStaticParams: the per-link prefetch could be served from a
// build-time prerender, which leaves out the short-lived stock. Without it, the
// per-link prefetch is rendered at runtime and includes the stock.

export default function PrefetchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="space-y-10">
      <Suspense fallback={<ProductHeroSkeleton />}>
        <ProductSummary params={params} />
      </Suspense>
      <RecommendationsSection>
        <Suspense fallback={<RecommendationsSkeleton />}>
          <ProductRecommendations params={params} />
        </Suspense>
      </RecommendationsSection>
    </div>
  );
}

async function ProductSummary({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return (
    <ProductHero
      product={product}
      source="use cache (hours)"
      stock={
        <Suspense fallback={<StockSkeleton />}>
          <ProductStock id={id} />
        </Suspense>
      }
    />
  );
}

async function ProductRecommendations({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Runs on navigation, not in the App Shell or the per-link prefetch
  await connection();
  return (
    <RecommendationsView
      recommendations={await getRecommendations(id)}
      source="connection() + use cache (10 秒)"
    />
  );
}

// Depends on params, so it stays out of the App Shell. It's cached, so the
// per-link prefetch from <Link prefetch={true}> includes it.
async function ProductStock({ id }: { id: string }) {
  return (
    <StockView stock={await getStockCached(id)} source="use cache (10 秒)" />
  );
}
