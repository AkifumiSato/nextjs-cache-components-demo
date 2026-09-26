import { connection } from "next/server";
import { Suspense } from "react";
import { type DemoRoute, getProduct, sleep } from "../_lib/products";
import { ProductHeader } from "./product-header";
import { sections } from "./product-sections";
import { RouteBadge } from "./route-badge";
import { SectionCard, SectionSkeleton } from "./section-card";

type Params = Promise<{ id: string }>;

// Cached content with stale >= 5min is included in the App Shell
async function ShellInfo() {
  "use cache";
  return (
    <div className="text-xs font-mono text-neutral-500">
      App Shell キャッシュ時刻: {new Date().toLocaleTimeString()}
    </div>
  );
}

// Depends on URL data (params), so it resolves after navigation
async function ProductHeaderLoader({ params }: { params: Params }) {
  const { id } = await params;
  return <ProductHeader id={id} />;
}

async function SlowSection({
  params,
  index,
}: {
  params: Params;
  index: number;
}) {
  const { title, delay, body } = sections[index];
  const { id } = await params;
  await connection();
  await sleep(delay);
  return (
    <SectionCard
      title={title}
      delay={delay}
      renderedAt={new Date().toLocaleTimeString()}
    >
      {body(getProduct(id).name)}
    </SectionCard>
  );
}

export function InstantProductPage({
  params,
  route,
}: {
  params: Params;
  route: DemoRoute;
}) {
  return (
    <div>
      <div className="mb-6 space-y-2">
        <RouteBadge route={route} />
        <ShellInfo />
      </div>

      <div className="mb-6">
        <Suspense
          fallback={<div className="h-7 w-64 bg-neutral-800 rounded" />}
        >
          <ProductHeaderLoader params={params} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section, index) => (
          <Suspense
            key={section.title}
            fallback={<SectionSkeleton title={section.title} />}
          >
            <SlowSection params={params} index={index} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
