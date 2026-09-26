import { BackLink } from "../_components/back-link";
import { RouteTag } from "../_components/route-tag";

export default function InstantPrefetchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <BackLink />
        <RouteTag variant="prefetch-true" />
        <p className="mt-3 text-sm text-neutral-400">
          リンクに prefetch={"{true}"} を指定。App Shell に加えて、params
          に依存するキャッシュ済みの価格まで事前に取得するため、prefetch
          が完了していればクリックした瞬間に商品名・価格まで表示されます。
        </p>
      </div>
      {children}
    </div>
  );
}
