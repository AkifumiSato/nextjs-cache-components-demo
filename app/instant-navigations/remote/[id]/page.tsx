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
  getStockRemote,
} from "../../_lib/data";

export const instant = true;

export function generateStaticParams() {
  return [{ id: "7" }, { id: "8" }];
}

export default function RemotePage({
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

// connection() keeps the stock out of prerenders, so it is rendered on every
// request. The remote cache lets those requests share the result across
// server instances.
async function ProductStock({ id }: { id: string }) {
  await connection();
  return (
    <StockView
      stock={await getStockRemote(id)}
      source="use cache: remote (5 分)"
    />
  );
}
