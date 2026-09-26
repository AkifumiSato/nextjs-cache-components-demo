import { ProductHero, ReviewsView, StockTag } from "../../_components/product";
import { getPrice, getReviews, getStock } from "../../_lib/data";

// Opts out of instant validation. This does not change runtime behavior:
// the navigation blocks because the page awaits everything without Suspense.
export const instant = false;

export function generateStaticParams() {
  return [{ id: "7" }, { id: "8" }];
}

export default async function BlockingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [price, reviews, stock] = await Promise.all([
    getPrice(id),
    getReviews(id),
    getStock(id),
  ]);

  return (
    <div className="space-y-10">
      <ProductHero
        id={id}
        price={price.price}
        cachedAt={price.cachedAt}
        stock={<StockTag {...stock} />}
      />
      <ReviewsView {...reviews} />
    </div>
  );
}
