import { cacheLife } from "next/cache";
import { connection } from "next/server";

// Products are paired within each demo route (1-2, 3-4, 5-6, 7-8)
const products: Record<
  string,
  { name: string; price: number; inStock: boolean }
> = {
  "1": { name: "メカニカルキーボード", price: 12800, inStock: true },
  "2": { name: "ワイヤレスマウス", price: 4980, inStock: false },
  "3": { name: "4K モニター", price: 39800, inStock: true },
  "4": { name: "USB-C ハブ", price: 3480, inStock: false },
  "5": { name: "ノイズキャンセリングヘッドホン", price: 29800, inStock: true },
  "6": { name: "スタンディングデスク", price: 54800, inStock: false },
  "7": { name: "Web カメラ", price: 8980, inStock: true },
  "8": { name: "モニターアーム", price: 7980, inStock: false },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProductName(id: string) {
  return products[id]?.name ?? "不明な商品";
}

// Prices rarely change, so they are cached and resolved at build time
// for the params returned by generateStaticParams
export async function getPrice(id: string) {
  "use cache";
  cacheLife("hours");
  await sleep(1000);
  return {
    price: products[id]?.price ?? 0,
    cachedAt: new Date().toLocaleTimeString(),
  };
}

// Reviews and stock must be fresh, so they are fetched per request
export async function getReviews(id: string) {
  await connection();
  await sleep(2000);
  return {
    rating: 4,
    count: Number(id) * 37,
    items: [
      { author: "Aさん", body: "期待どおりの品質で満足しています。" },
      { author: "Bさん", body: "配送も早く、梱包も丁寧でした。" },
      { author: "Cさん", body: "価格を考えると十分な性能です。" },
    ],
    fetchedAt: new Date().toLocaleTimeString(),
  };
}

export async function getStock(id: string) {
  await connection();
  await sleep(3000);
  return { inStock: products[id]?.inStock ?? false };
}
