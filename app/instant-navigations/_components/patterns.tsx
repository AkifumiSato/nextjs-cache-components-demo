import { BackLink } from "./back-link";

type Pattern = {
  label: string;
  className: string;
  href: string;
  ids: readonly string[];
  prefetch: true | undefined;
  // What this pattern adds, shown as the step's key technique
  change: string;
  // What to look for right after clicking
  observe: string;
  // When each part of the page arrives
  stages: readonly { stage: string; content: string }[];
  code: string;
};

export const patterns = {
  legacy: {
    label: "legacy",
    className: "border-amber-700/60 bg-amber-950/40 text-amber-300",
    href: "/instant-navigations/dynamic",
    ids: ["1", "2"],
    prefetch: undefined,
    change: "キャッシュも Suspense もなし",
    observe: "全データが揃うまで（約 2 秒）画面が切り替わらない",
    stages: [
      { stage: "prefetch", content: "レイアウトのみ" },
      {
        stage: "遷移時",
        content: "商品情報・レコメンド・在庫をすべて取得してから一括表示",
      },
    ],
    code: `export const instant = false;

export default async function Page({ params }) {
  const { id } = await params;
  const [product, recommendations, stock] = await Promise.all([
    getProductDynamic(id),
    getRecommendationsDynamic(id),
    getStockDynamic(id),
  ]);
  // ...
}`,
  },
  instant: {
    label: "instant",
    className: "border-sky-700/60 bg-sky-950/40 text-sky-300",
    href: "/instant-navigations/cached",
    ids: ["3", "4"],
    prefetch: undefined,
    change: "Suspense + use cache + generateStaticParams",
    observe: "App Shell（見出し・skeleton）が即表示され、中身は後から届く",
    stages: [
      {
        stage: "prefetch（App Shell）",
        content: "レイアウト・見出し・skeleton",
      },
      { stage: "遷移の応答", content: "商品情報（use cache）" },
      {
        stage: "Streaming（遷移時）",
        content:
          "レコメンド（connection() + use cache）・在庫（connection()・毎リクエスト取得・1.5 秒）",
      },
    ],
    code: `export const instant = true;

export function generateStaticParams() {
  return [{ id: "3" }, { id: "4" }];
}

// params を await せず Suspense の内側で読むので、外側が App Shell になる
export default function Page({ params }) {
  return (
    <Suspense fallback={<ProductHeroSkeleton />}>
      <ProductSummary params={params} />
    </Suspense>
  );
}

async function ProductRecommendations({ params }) {
  const { id } = await params;
  // レコメンドはキャッシュするが、connection() で prerender・prefetch から外す
  await connection();
  return <RecommendationsView recommendations={await getRecommendations(id)} />;
}`,
  },
  instantPrefetch: {
    label: "instant + prefetch",
    className: "border-emerald-700/60 bg-emerald-950/40 text-emerald-300",
    href: "/instant-navigations/prefetch",
    ids: ["5", "6"],
    prefetch: true,
    change: "prefetch={true} + prefetch()",
    observe: "商品情報・レコメンド・在庫がクリック直後に表示される",
    stages: [
      {
        stage: "prefetch（リンク単位）",
        content:
          "App Shell ＋ 商品情報・レコメンド（prefetch() + use cache）・在庫（prefetch() + use cache 10 秒）",
      },
      { stage: "遷移の応答", content: "prefetch 済みの内容を表示" },
    ],
    code: `<Link href="/instant-navigations/prefetch/5" prefetch={true}>

async function ProductStock({ id }) {
  // App Shell からは外すが、リンク単位の prefetch では実行される
  await prefetch();
  return <StockView stock={await getStockCached(id)} />;
}`,
  },
} as const satisfies Record<string, Pattern>;

export type PatternKey = keyof typeof patterns;

export const patternKeys = Object.keys(patterns) as PatternKey[];

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
  const { observe, stages, code } = patterns[pattern];
  return (
    <div>
      <div className="mb-8">
        <BackLink />
        <div className="flex flex-wrap items-center gap-3">
          <PatternTag pattern={pattern} />
          <span className="text-sm text-neutral-400">{observe}</span>
        </div>
      </div>
      {children}
      <section className="mt-16 border-t border-neutral-800 pt-6">
        <h2 className="mb-4 font-medium text-neutral-100">
          このページで起きたこと
        </h2>
        <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {stages.map(({ stage, content }) => (
            <div key={stage} className="contents">
              <dt className="text-neutral-500">{stage}</dt>
              <dd className="text-neutral-300">{content}</dd>
            </div>
          ))}
        </dl>
        <pre className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 text-xs leading-relaxed text-neutral-300">
          <code>{code}</code>
        </pre>
      </section>
    </div>
  );
}
