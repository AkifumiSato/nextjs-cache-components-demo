import { Suspense } from "react";
import {
  ProductSummary,
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
      </Suspense>
    </div>
  );
}
