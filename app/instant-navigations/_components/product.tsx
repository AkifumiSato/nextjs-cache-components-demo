import type { Product, Recommendations, Stock } from "../_lib/data";

// Views

export function ProductHero({
  product,
  source,
  stock,
}: {
  product: Product;
  source: string;
  stock: React.ReactNode;
}) {
  return (
    <HeroFrame initial={product.name.charAt(0)}>
      <h2 className="text-2xl font-semibold text-neutral-100">
        {product.name}
      </h2>
      <div className="mt-3 text-3xl font-semibold text-neutral-100">
        ¥{product.price.toLocaleString()}
      </div>
      <Meta>
        {source} ・ 生成時刻: {product.renderedAt}
      </Meta>
      <div className="mt-5">{stock}</div>
    </HeroFrame>
  );
}

export function StockView({ stock, source }: { stock: Stock; source: string }) {
  return (
    <StockRow>
      {stock.count > 0 ? (
        <span
          className={`${stockTagClassName} border-emerald-700/60 bg-emerald-950/40 text-emerald-300`}
        >
          在庫あり（{stock.count}）
        </span>
      ) : (
        <span
          className={`${stockTagClassName} border-neutral-700 bg-neutral-800/60 text-neutral-400`}
        >
          在庫なし
        </span>
      )}
      <span className="whitespace-nowrap text-xs font-mono text-neutral-500">
        {source} ・ 取得時刻: {stock.renderedAt}
      </span>
    </StockRow>
  );
}

// Rendered outside Suspense so the heading is part of the App Shell
export function RecommendationsSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 border-b border-neutral-800 pb-2 font-medium text-neutral-100">
        この商品を見た人はこちらも
      </h3>
      {children}
    </section>
  );
}

export function RecommendationsView({
  recommendations,
  source,
}: {
  recommendations: Recommendations;
  source: string;
}) {
  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recommendations.items.map((item) => (
          <li
            key={item.id}
            className="h-20 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3"
          >
            <div className="text-sm text-neutral-200">{item.name}</div>
            <div className="mt-1 text-sm text-neutral-400">
              ¥{item.price.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      <Meta>
        {source} ・ 生成時刻: {recommendations.renderedAt}
      </Meta>
    </div>
  );
}

// Fixed size so the tag doesn't shift the layout when it replaces the skeleton
const stockTagClassName =
  "inline-flex h-6 w-28 items-center justify-center rounded border text-xs font-medium";

function HeroFrame({
  initial,
  children,
}: {
  initial?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
      <div
        className={`aspect-square rounded-lg border border-neutral-800 bg-neutral-800/40 flex items-center justify-center text-4xl text-neutral-600 ${
          initial ? "" : "animate-pulse"
        }`}
      >
        {initial}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 text-xs font-mono text-neutral-500">{children}</div>
  );
}

// Skeletons

function Bar({ className }: { className: string }) {
  return (
    <div className={`bg-neutral-800 rounded animate-pulse ${className}`} />
  );
}

export function ProductHeroSkeleton() {
  return (
    <HeroFrame>
      <Bar className="h-8 w-64" />
      <Bar className="mt-3 h-9 w-32" />
      <Bar className="mt-2 h-4 w-48" />
      <div className="mt-5">
        <StockSkeleton />
      </div>
    </HeroFrame>
  );
}

// Same row as StockView so that replacing the skeleton doesn't move the content
// below it
export function StockSkeleton() {
  return (
    <StockRow>
      <Bar className="h-6 w-28" />
      <Bar className="h-4 w-56" />
    </StockRow>
  );
}

// Fixed height: the source text sits on the same line as the tag and never wraps
function StockRow({ children }: { children: React.ReactNode }) {
  return <div className="flex h-6 items-center gap-x-3">{children}</div>;
}

export function RecommendationsSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Bar className="h-20" />
        <Bar className="h-20" />
        <Bar className="h-20" />
      </div>
      <Bar className="mt-2 h-4 w-48" />
    </div>
  );
}
