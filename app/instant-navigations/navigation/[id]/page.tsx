import { navigation } from "next/cache";
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

// No generateStaticParams: navigation() only applies to runtime rendering.
// A build-time prerender would include the stock, and the per-link prefetch
// would be served from it.

export default function NavigationPage({
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
  return (
    <RecommendationsView
      recommendations={await getRecommendations(id)}
      source="use cache (hours)"
    />
  );
}

// The per-link prefetch stops here and includes the StockSkeleton fallback.
// The stock is fetched when the user navigates.
async function ProductStock({ id }: { id: string }) {
  await navigation();
  return (
    <StockView
      stock={await getStockCached(id)}
      source="use cache (5 分) + navigation()"
    />
  );
}
