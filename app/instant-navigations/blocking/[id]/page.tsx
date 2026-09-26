import { connection } from "next/server";
import { ProductHeader } from "../../_components/product-header";
import { sections } from "../../_components/product-sections";
import { RouteBadge } from "../../_components/route-badge";
import { SectionCard } from "../../_components/section-card";
import { getProduct, sleep } from "../../_lib/products";

// Opts out of instant validation. This does not change runtime behavior:
// the navigation blocks because the page awaits everything without Suspense.
export const instant = false;

export default async function BlockingProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connection();
  await sleep(Math.max(...sections.map((section) => section.delay)));

  const product = getProduct(id);
  const renderedAt = new Date().toLocaleTimeString();

  return (
    <div>
      <div className="mb-6">
        <RouteBadge route="blocking" />
      </div>

      <div className="mb-6">
        <ProductHeader id={id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <SectionCard
            key={section.title}
            title={section.title}
            delay={section.delay}
            renderedAt={renderedAt}
          >
            {section.body(product.name)}
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
