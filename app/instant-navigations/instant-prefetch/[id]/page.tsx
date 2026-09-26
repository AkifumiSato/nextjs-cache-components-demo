import { Suspense } from "react";
import {
  ProductSummary,
  Recommendations,
  RecommendationsSkeleton,
  Reviews,
  ReviewsSkeleton,
} from "../../_components/product";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function InstantPrefetchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-10">
      <ProductSummary id={id} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews id={id} />
        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations
            id={id}
            basePath="/instant-navigations/instant-prefetch"
            prefetch={true}
          />
        </Suspense>
      </Suspense>
    </div>
  );
}
