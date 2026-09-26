// Heavy sections shared by the instant and blocking pages
export const sections = [
  { title: "価格", delay: 1000, body: (name: string) => `${name}: ¥12,800` },
  {
    title: "レビュー",
    delay: 2000,
    body: (name: string) => `★★★★☆ ${name} のレビュー 128 件`,
  },
  {
    title: "おすすめ",
    delay: 3000,
    body: (name: string) => `${name} を買った人はこんな商品も買っています...`,
  },
];
