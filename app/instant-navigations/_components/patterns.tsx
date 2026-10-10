import { BackLink } from "./back-link";

export const patterns = {
  dynamic: {
    label: "legacy",
    className: "border-amber-700/60 bg-amber-950/40 text-amber-300",
    href: "/instant-navigations/dynamic",
    ids: ["1", "2"],
    prefetch: undefined,
    summary: (
      <>
        キャッシュも Suspense もなく、毎リクエスト全データを取得して await
        するページです。すべて揃うまで（約 2 秒）画面が切り替わりません。
      </>
    ),
  },
  cached: {
    label: "instant",
    className: "border-sky-700/60 bg-sky-950/40 text-sky-300",
    href: "/instant-navigations/cached",
    ids: ["3", "4"],
    prefetch: undefined,
    summary: (
      <>
        商品情報・レコメンドを use cache し、generateStaticParams で prerender
        したページです。params を Suspense の内側で読むため、URL
        に依存しない部分（レイアウト・見出し・skeleton）が App Shell
        になり、クリック直後に表示されます。商品情報・レコメンドは遷移の応答で、毎リクエスト取得する在庫（1.5
        秒）はその後 Streaming されます。
      </>
    ),
  },
  navigation: {
    label: "instant + prefetch",
    className: "border-emerald-700/60 bg-emerald-950/40 text-emerald-300",
    href: "/instant-navigations/navigation",
    ids: ["5", "6"],
    prefetch: true,
    summary: (
      <>
        リンクに prefetch={"{true}"}{" "}
        を指定し、キャッシュ済みの商品情報・レコメンドまでリンクごとに prefetch
        します。在庫（use cache・5 分）だけは await navigation()
        で遷移まで待たせるため、クリック直後は在庫以外がすべて表示され、在庫は遷移時に取得されます。
      </>
    ),
  },
  remote: {
    label: "instant + prefetch + remote cache",
    className: "border-violet-700/60 bg-violet-950/40 text-violet-300",
    href: "/instant-navigations/remote",
    ids: ["7", "8"],
    prefetch: undefined,
    summary: (
      <>
        use cache + generateStaticParams と同じ構成で、在庫だけを connection()
        以降の動的コンテンツのまま use cache: remote（5
        分）でキャッシュします。初回は在庫の取得（1.5 秒）を待ちますが、2
        回目以降はリクエストを跨いでキャッシュが使われ、遷移の応答と同時に表示されます。
      </>
    ),
  },
} as const;

export type PatternKey = keyof typeof patterns;

export function PatternTag({ pattern }: { pattern: PatternKey }) {
  const { label, className } = patterns[pattern];
  return (
    <span
      className={`inline-block text-xs font-medium font-mono px-2 py-1 rounded border ${className}`}
    >
      {label}
    </span>
  );
}

export function PatternLayout({
  pattern,
  children,
}: {
  pattern: PatternKey;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <BackLink />
        <PatternTag pattern={pattern} />
        <p className="mt-3 text-sm text-neutral-400">
          {patterns[pattern].summary}
        </p>
      </div>
      {children}
    </div>
  );
}
