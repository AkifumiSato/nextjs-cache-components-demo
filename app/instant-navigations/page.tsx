import Link from "next/link";
import { PendingHint } from "./_components/pending-hint";
import {
  demoRoutes,
  getProductsByRoute,
  productHref,
  productPrefetch,
} from "./_lib/products";

export default function InstantNavigationsPage() {
  return (
    <div>
      <div className="text-neutral-400 space-y-2 mb-8 max-w-3xl">
        <p>
          3 つのルートに 2
          商品ずつ配置しています。どの商品ページも内容は同じで、重いセクション（1〜3
          秒）を含みます。ルートごとの遷移の違いを比べてみてください。
        </p>
        <p className="text-sm text-neutral-500">
          prefetch は dev では行われません。
          <code>next build &amp;&amp; next start</code> で Network
          タブを開くと、App Shell の prefetch は URL
          ごとではなくルートごとに発生します（prefetch なしのルートを除く）。
        </p>
      </div>

      <div className="space-y-6">
        {demoRoutes.map((demoRoute) => (
          <section key={demoRoute.route}>
            <h2 className="font-medium text-neutral-100">{demoRoute.label}</h2>
            <p className="text-sm text-neutral-400 mt-1 mb-3">
              {demoRoute.description}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getProductsByRoute(demoRoute.route).map((product) => (
                <li key={product.id}>
                  <Link
                    href={productHref(product)}
                    prefetch={productPrefetch(product)}
                    className={`flex items-center justify-between gap-2 p-4 rounded-lg border transition-colors ${demoRoute.linkClassName}`}
                  >
                    <span>{product.name}</span>
                    <PendingHint />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
