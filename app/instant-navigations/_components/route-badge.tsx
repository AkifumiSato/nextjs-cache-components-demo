import { type DemoRoute, getDemoRoute } from "../_lib/products";

export function RouteBadge({ route }: { route: DemoRoute }) {
  const demoRoute = getDemoRoute(route);
  return (
    <div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded border ${demoRoute.badgeClassName}`}
      >
        {demoRoute.label}
      </span>
      <p className="mt-3 text-sm text-neutral-400">{demoRoute.description}</p>
    </div>
  );
}
