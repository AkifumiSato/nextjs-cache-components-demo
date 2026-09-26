import { Suspense } from "react";
import {
  ProductSummary,
  Recommendations,
  RecommendationsSkeleton,
  Reviews,
  ReviewsSkeleton,
} from "../../_components/product";

export function generateStaticParams() {
  return [{ id: "3" }, { id: "4" }];
}

export default async function InstantAppShellPage({
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
            basePath="/instant-navigations/instant-app-shell"
          />
        </Suspense>
      </Suspense>
    </div>
  );
}
