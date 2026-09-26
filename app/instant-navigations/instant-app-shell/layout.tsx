import { RouteTag } from "../_components/route-tag";

export default function InstantAppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <RouteTag variant="app-shell" />
        <p className="mt-3 text-sm text-neutral-400">
          デフォルトの Link。ルート共通の App Shell（loading.tsx の
          skeleton）だけを prefetch するため、クリックするとまず skeleton
          が表示され、商品名・価格は遷移後に届きます。ただし一覧ページの 4K
          モニター（最初のリンク）だけは、中身まで即座に表示されます。
        </p>
      </div>
      {children}
    </div>
  );
}
