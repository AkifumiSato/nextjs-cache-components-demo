import { BackLink } from "../_components/back-link";
import { RouteTag } from "../_components/route-tag";

export default function BlockingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <BackLink />
        <RouteTag variant="blocking" />
        <p className="mt-3 text-sm text-neutral-400">
          loading.tsx も Suspense もなく全データを await
          するため、すべて揃うまで（約 3 秒）画面が切り替わりません。instant =
          false は検証の insight を止めるだけで、挙動は変えません。
        </p>
      </div>
      {children}
    </div>
  );
}
