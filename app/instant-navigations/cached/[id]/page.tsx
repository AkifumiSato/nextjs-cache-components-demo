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
  getStockDynamic,
} from "../../_lib/data";

export const instant = true;

export function generateStaticParams() {
  return [{ id: "3" }, { id: "4" }];
}

// The page doesn't await params, so everything outside the Suspense
// boundaries below (layout, headings, skeletons) becomes the App Shell
export default function CachedPage({
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
  // Keeps the recommendations out of prerenders and prefetches. The data is
  // still cached, so only the first request per product waits for it.
  await connection();
  return (
    <RecommendationsView
      recommendations={await getRecommendations(id)}
      source="connection() + use cache (hours)"
    />
  );
}

async function ProductStock({ id }: { id: string }) {
  return (
    <StockView stock={await getStockDynamic(id)} source="毎リクエスト取得" />
  );
}
