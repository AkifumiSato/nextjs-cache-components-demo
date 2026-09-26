import { ProductPageSkeleton } from "../../_components/product";

// The Suspense boundary for params. This skeleton becomes the App Shell.
export default function Loading() {
  return <ProductPageSkeleton />;
}
