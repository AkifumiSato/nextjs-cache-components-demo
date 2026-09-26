import Link from "next/link";
import {
  getProduct,
  getSiblings,
  productHref,
  productPrefetch,
} from "../_lib/products";
import { PendingHint } from "./pending-hint";

export function ProductHeader({ id }: { id: string }) {
  const product = getProduct(id);
  const { prev, next } = getSiblings(id);
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold text-neutral-100">{product.name}</h2>
      <div className="flex gap-4 text-sm text-neutral-400">
        <Link
          href={productHref(prev)}
          prefetch={productPrefetch(prev)}
          className="flex items-center gap-2 hover:text-neutral-100"
        >
          ← 前へ <PendingHint />
        </Link>
        <Link
          href={productHref(next)}
          prefetch={productPrefetch(next)}
          className="flex items-center gap-2 hover:text-neutral-100"
        >
          次へ → <PendingHint />
        </Link>
      </div>
    </div>
  );
}
