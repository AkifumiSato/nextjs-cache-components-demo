export type DemoRoute = "instant-prefetch" | "instant-no-prefetch" | "blocking";

export const demoRoutes: {
  route: DemoRoute;
  label: string;
  prefetch: boolean;
  description: string;
  badgeClassName: string;
  linkClassName: string;
}[] = [
  {
    route: "instant-prefetch",
    label: "Instant + prefetch あり",
    prefetch: true,
    description:
      "App Shell を事前に prefetch 済み。クリックした瞬間に静的な部分が表示され、残りは Streaming で埋まります。",
    badgeClassName: "border-emerald-700/60 text-emerald-300",
    linkClassName:
      "border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/40",
  },
  {
    route: "instant-no-prefetch",
    label: "Instant + prefetch なし",
    prefetch: false,
    description:
      "リンクに prefetch={false} を指定。構造は Instant と同じですが、クリック後にサーバーへの往復を待ってから静的な部分が表示されます。",
    badgeClassName: "border-sky-700/60 text-sky-300",
    linkClassName: "border-sky-700/60 text-sky-300 hover:bg-sky-950/40",
  },
  {
    route: "blocking",
    label: "Blocking",
    prefetch: true,
    description:
      "instant = false。Suspense なしで全データを await するため、すべて揃うまで画面が切り替わりません。",
    badgeClassName: "border-amber-700/60 text-amber-300",
    linkClassName: "border-amber-700/60 text-amber-300 hover:bg-amber-950/40",
  },
];

export const products: { id: string; name: string; route: DemoRoute }[] = [
  { id: "1", name: "メカニカルキーボード", route: "instant-prefetch" },
  { id: "2", name: "ワイヤレスマウス", route: "instant-prefetch" },
  { id: "3", name: "4K モニター", route: "instant-no-prefetch" },
  { id: "4", name: "USB-C ハブ", route: "instant-no-prefetch" },
  { id: "5", name: "ノイズキャンセリングヘッドホン", route: "blocking" },
  { id: "6", name: "スタンディングデスク", route: "blocking" },
];

export function getDemoRoute(route: DemoRoute) {
  return demoRoutes.find((demoRoute) => demoRoute.route === route);
}

export function getProductsByRoute(route: DemoRoute) {
  return products.filter((product) => product.route === route);
}

export function productHref(product: { id: string; route: DemoRoute }) {
  return `/instant-navigations/${product.route}/${product.id}`;
}

// Link-level opt-out. `export const prefetch = "force-disabled"` on the segment
// doesn't work for this demo: under partialPrefetching it still ends up
// prefetching the page via a runtime request.
export function productPrefetch(product: { route: DemoRoute }) {
  return getDemoRoute(product.route).prefetch ? undefined : false;
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id) ?? products[0];
}

// Prev/next within the same route, so navigations stay in one segment
export function getSiblings(id: string) {
  const group = getProductsByRoute(getProduct(id).route);
  const index = group.findIndex((product) => product.id === id);
  return {
    prev: group[(index - 1 + group.length) % group.length],
    next: group[(index + 1) % group.length],
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
