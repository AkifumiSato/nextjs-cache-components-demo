import { RouteTag } from "../_components/route-tag";

export default function InstantNoPrefetchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <RouteTag variant="no-prefetch" />
        <p className="mt-3 text-sm text-neutral-400">
          リンクに prefetch={"{false}"} を指定。何も prefetch
          しないため、クリックしてもサーバーの応答が届くまで画面は切り替わらず、その後
          skeleton、続いて中身が表示されます。
        </p>
      </div>
      {children}
    </div>
  );
}
