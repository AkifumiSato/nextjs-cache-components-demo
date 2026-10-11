import { ProductPage } from "../../_components/product-page";

export const instant = true;

export default function InstantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductPage params={params} stockStage="navigation" />;
}
