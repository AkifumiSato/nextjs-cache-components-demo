import { prefetch } from "next/cache";
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

// No generateStaticParams: a build-time prerender would include the
// recommendations and stock below prefetch(). Without it, they are generated
// at runtime by the per-link prefetch.

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
  // Keeps the recommendations out of the App Shell, but unlike connection()
  // they are rendered by the per-link prefetch from <Link prefetch={true}>
  await prefetch();
  return (
    <RecommendationsView
      recommendations={await getRecommendations(id)}
      source="prefetch() + use cache (hours)"
    />
  );
}

// Resolved at prefetch time, so the per-link prefetch includes the stock
async function ProductStock({ id }: { id: string }) {
  await prefetch();
  return (
    <StockView
      stock={await getStockCached(id)}
      source="use cache (10 秒) + prefetch()"
    />
  );
}
