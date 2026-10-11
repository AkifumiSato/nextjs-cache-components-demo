import { navigation, prefetch } from "next/cache";
import { connection } from "next/server";
import { Suspense } from "react";
import { getProduct, getRecommendations, getStock } from "../_lib/data";
import {
  ProductHero,
  ProductHeroSkeleton,
  RecommendationsSection,
  RecommendationsSkeleton,
  RecommendationsView,
  StockSkeleton,
  StockView,
} from "./product";

type Props = {
  params: Promise<{ id: string }>;
  // When the stock resolves: on navigation (instant), or in the per-link
  // prefetch (instant + prefetch)
  stockStage: "navigation" | "prefetch";
};

// Shared by the instant and instant + prefetch patterns.
//
// Neither page uses generateStaticParams. Static prerenders include content
// below navigation() and prefetch(), so a prerendered URL would ship the stock
// before navigation.
//
// params isn't awaited here, so everything outside the Suspense boundaries
// below (layout, headings, skeletons) becomes the App Shell.
export function ProductPage({ params, stockStage }: Props) {
  return (
    <div className="space-y-10">
      <Suspense fallback={<ProductHeroSkeleton />}>
        <ProductSummary params={params} stockStage={stockStage} />
      </Suspense>
      <RecommendationsSection>
        <Suspense fallback={<RecommendationsSkeleton />}>
          <ProductRecommendations params={params} />
        </Suspense>
      </RecommendationsSection>
    </div>
  );
}

async function ProductSummary({ params, stockStage }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  return (
    <ProductHero
      product={product}
      source="use cache (hours)"
      stock={
        <Suspense fallback={<StockSkeleton />}>
          <ProductStock id={id} stage={stockStage} />
        </Suspense>
      }
    />
  );
}

async function ProductStock({
  id,
  stage,
}: {
  id: string;
  stage: Props["stockStage"];
}) {
  if (stage === "navigation") {
    // Below this, nothing runs until the user navigates
    await navigation();
  } else {
    // Below this, nothing runs in the App Shell, but it runs in the per-link
    // prefetch from <Link prefetch={true}>
    await prefetch();
  }
  return (
    <StockView
      stock={await getStock(id)}
      source={`use cache (10 秒) + ${stage}()`}
    />
  );
}

async function ProductRecommendations({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Keeps the recommendations out of prerenders and prefetches, so they are
  // always rendered on navigation. The data itself is still cached.
  await connection();
  return (
    <RecommendationsView
      recommendations={await getRecommendations(id)}
      source="connection() + use cache (10 秒)"
    />
  );
}
