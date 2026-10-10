import { cacheLife } from "next/cache";
import { connection } from "next/server";

// Products are paired within each demo route (1-2, 3-4, 5-6, 7-8)
const products: Record<string, { name: string; price: number; stock: number }> =
  {
    "1": { name: "メカニカルキーボード", price: 12800, stock: 12 },
    "2": { name: "ワイヤレスマウス", price: 4980, stock: 0 },
    "3": { name: "4K モニター", price: 39800, stock: 3 },
    "4": { name: "USB-C ハブ", price: 3480, stock: 0 },
    "5": { name: "ヘッドホン", price: 29800, stock: 7 },
    "6": { name: "スタンディングデスク", price: 54800, stock: 0 },
    "7": { name: "Web カメラ", price: 8980, stock: 21 },
    "8": { name: "モニターアーム", price: 7980, stock: 0 },
  };

export type Product = Awaited<ReturnType<typeof fetchProduct>>;
export type Recommendations = Awaited<ReturnType<typeof fetchRecommendations>>;
export type Stock = Awaited<ReturnType<typeof fetchStock>>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function now() {
  return new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export function getProductName(id: string) {
  return products[id]?.name ?? "不明な商品";
}

// Upstream APIs (simulated latency)

async function fetchProduct(id: string) {
  await sleep(1000);
  return {
    name: getProductName(id),
    price: products[id]?.price ?? 0,
    renderedAt: now(),
  };
}

async function fetchRecommendations(id: string) {
  await sleep(2000);
  // Pick 3 other products deterministically
  const items = [1, 2, 3].map((n) => {
    const key = String(((Number(id) - 1 + n * 3) % 8) + 1);
    return { id: key, name: getProductName(key), price: products[key].price };
  });
  return { items, renderedAt: now() };
}

async function fetchStock(id: string) {
  await sleep(1500);
  return { count: products[id]?.stock ?? 0, renderedAt: now() };
}

// Dynamic: fetched on every request

export async function getProductDynamic(id: string) {
  await connection();
  return fetchProduct(id);
}

export async function getRecommendationsDynamic(id: string) {
  await connection();
  return fetchRecommendations(id);
}

// Stock can't be cached, so every pattern fetches it on every request
export async function getStockDynamic(id: string) {
  await connection();
  return fetchStock(id);
}

// Short enough to refresh often, long enough to absorb repeated prefetches.
// expire must be longer than revalidate.
const shortCacheLife = { stale: 10, revalidate: 10, expire: 20 };

// Product details rarely change, so they are cached and can be prerendered
// or prefetched

export async function getProduct(id: string) {
  "use cache";
  cacheLife("hours");
  return fetchProduct(id);
}

// Recommendations can be cached, but pages defer them to runtime with
// connection() or prefetch() so they aren't generated at build time
export async function getRecommendations(id: string) {
  "use cache";
  cacheLife(shortCacheLife);
  return fetchRecommendations(id);
}

// Stock cached for the prefetch pattern. Its per-link prefetch runs for every
// visible link, so the cache keeps the stock API calls down.
export async function getStockCached(id: string) {
  "use cache";
  cacheLife(shortCacheLife);
  return fetchStock(id);
}
