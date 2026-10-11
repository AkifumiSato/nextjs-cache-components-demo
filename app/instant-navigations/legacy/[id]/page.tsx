import {
  ProductHero,
  RecommendationsSection,
  RecommendationsView,
  StockView,
} from "../../_components/product";
import {
  getProductDynamic,
  getRecommendationsDynamic,
  getStockDynamic,
} from "../../_lib/data";

// Opts out of instant validation. This does not change runtime behavior:
// the navigation blocks because the page awaits everything without Suspense.
export const instant = false;

export default async function LegacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, recommendations, stock] = await Promise.all([
    getProductDynamic(id),
    getRecommendationsDynamic(id),
    getStockDynamic(id),
  ]);

  return (
    <div className="space-y-10">
      <ProductHero
        product={product}
        source="毎リクエスト取得"
        stock={<StockView stock={stock} source="毎リクエスト取得" />}
      />
      <RecommendationsSection>
        <RecommendationsView
          recommendations={recommendations}
          source="毎リクエスト取得"
        />
      </RecommendationsSection>
    </div>
  );
}
