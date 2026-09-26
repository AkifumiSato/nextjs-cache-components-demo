import { Suspense } from "react";
import {
  ProductSummary,
  Recommendations,
  RecommendationsSkeleton,
  Reviews,
  ReviewsSkeleton,
} from "../../_components/product";

// Links to this route use prefetch={false}. `export const prefetch =
// "force-disabled"` doesn't work here: under partialPrefetching it still
// prefetches the page via a runtime request.

export function generateStaticParams() {
  return [{ id: "5" }, { id: "6" }];
}

export default async function InstantNoPrefetchPage({
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
      </Suspense>
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations
          id={id}
          basePath="/instant-navigations/instant-no-prefetch"
          prefetch={false}
        />
      </Suspense>
    </div>
  );
}
