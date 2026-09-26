import { InstantProductPage } from "../../_components/instant-product-page";

export default function InstantPrefetchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <InstantProductPage params={params} route="instant-prefetch" />;
}
