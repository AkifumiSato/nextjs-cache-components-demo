import Link from "next/link";
import { Faq } from "./_components/faq";
import { Note } from "./_components/note";
import {
  type PatternKey,
  PatternTag,
  patternKeys,
  patterns,
} from "./_components/patterns";
import { PendingHint } from "./_components/pending-hint";
import { Tabs } from "./_components/tabs";
import { getProductName } from "./_lib/data";

export default function InstantNavigationsPage() {
  return (
    <div>
      <div className="mb-6 space-y-4">
        <p className="text-neutral-400">
          キャッシュと prefetch の設計によって、遷移体験がどう変わるかを 3
          段階で比べるデモです。下に行くほど 1 つずつ手法を足していきます。
        </p>
        <Note summary="準備">
          <p>
            prefetch は dev では行われないため、
            <code>next build &amp;&amp; next start</code>{" "}
            で確認してください。localhost
            ではサーバーの応答が速く差が見えにくいので、DevTools の Network
            throttling（Slow 4G など）を使うと見やすくなります。
          </p>
          <p>
            商品ページはどれも、商品情報（1 秒）・レコメンド（2 秒）・在庫（1.5
            秒）を表示します。instant
            では商品情報だけをクリック前に用意し、レコメンドと在庫は遷移時に取得します。instant
            + prefetch
            では、在庫も含めてクリック前に用意します（在庫のキャッシュは 10
            秒）。各データの横に、どこで・いつ生成されたかを表示しています。
          </p>
        </Note>
      </div>

      <Tabs
        tabs={[
          { id: "demo", label: "DEMO", content: <DemoPanel /> },
          { id: "explain", label: "解説", content: <ExplainPanel /> },
        ]}
      />
    </div>
  );
}

function DemoPanel() {
  return (
    <div>
      <p className="mb-4 text-sm text-neutral-500">
        上から順にクリックして、
        <span className="text-neutral-300">クリック直後に何が見えるか</span>と
        <span className="text-neutral-300">
          レコメンド・在庫がいつ表示されるか
        </span>
        を比べてください。
      </p>
      <ol className="divide-y divide-neutral-800 rounded-lg border border-neutral-800 bg-neutral-900/40">
        {patternKeys.map((key, i) => (
          <PatternRow key={key} pattern={key} step={i + 1} />
        ))}
      </ol>
      <p className="mt-4 text-xs text-neutral-500">
        思った挙動と違ったときは「解説」タブを見てください。
      </p>
    </div>
  );
}

function PatternRow({ pattern, step }: { pattern: PatternKey; step: number }) {
  const { href, ids, prefetch, change, observe } = patterns[pattern];
  return (
    <li className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex gap-3">
        <span className="mt-0.5 font-mono text-sm text-neutral-600">
          {step}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <PatternTag pattern={pattern} />
            <span className="text-xs font-mono text-neutral-500">{change}</span>
          </div>
          <p className="mt-2 text-sm text-neutral-300">{observe}</p>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2 md:w-96">
        {ids.map((id) => (
          <li key={id}>
            <Link
              href={`${href}/${id}`}
              prefetch={prefetch}
              className="flex h-full items-center justify-between gap-2 rounded-lg border border-neutral-700/60 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-100 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              {getProductName(id)} <PendingHint />
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

const comparison: Record<
  PatternKey,
  {
    prefetched: string;
    onClick: string;
    recommendations: string;
    stock: string;
  }
> = {
  legacy: {
    prefetched: "レイアウトのみ",
    onClick: "切り替わらない（約 2 秒）",
    recommendations: "全データが揃ってから一括表示",
    stock: "全データが揃ってから一括表示",
  },
  instant: {
    prefetched: "App Shell（レイアウト・見出し・skeleton）",
    onClick: "skeleton → 遷移の応答で商品情報",
    recommendations: "遷移時に Streaming（キャッシュ内なら即座）",
    stock: "遷移時に Streaming（1.5 秒）",
  },
  instantPrefetch: {
    prefetched: "App Shell ＋ 商品情報・レコメンド・在庫",
    onClick: "すべて表示",
    recommendations: "prefetch 済み",
    stock: "prefetch 済み（10 秒キャッシュ内なら再取得なし）",
  },
};

function ExplainPanel() {
  return (
    <div>
      <ComparePanel />
      <section className="mt-16 border-t border-neutral-800 pt-6">
        <h2 className="mb-4 font-medium text-neutral-100">よくある質問</h2>
        <Faq />
      </section>
    </div>
  );
}

function ComparePanel() {
  return (
    <div>
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-neutral-500">
            <tr className="border-b border-neutral-800">
              <th className="py-2 pr-4 font-normal">パターン</th>
              <th className="py-2 pr-4 font-normal">prefetch されるもの</th>
              <th className="py-2 pr-4 font-normal">クリック直後</th>
              <th className="py-2 pr-4 font-normal">レコメンド</th>
              <th className="py-2 font-normal">在庫</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            {patternKeys.map((key) => (
              <tr
                key={key}
                className="border-b border-neutral-800/60 last:border-b-0"
              >
                <td className="py-2 pr-4">
                  <PatternTag pattern={key} />
                </td>
                <td className="py-2 pr-4">{comparison[key].prefetched}</td>
                <td className="py-2 pr-4">{comparison[key].onClick}</td>
                <td className="py-2 pr-4">{comparison[key].recommendations}</td>
                <td className="py-2">{comparison[key].stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-neutral-500">
        <p className="mb-1">
          在庫は instant では遷移時に毎回取得し、instant + prefetch では
          prefetch 時に取得します（10
          秒以内の再訪はキャッシュから即座）。上の表は典型的な挙動で、次の条件で変わることがあります（詳しくは下の
          Q&amp;A）。
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            instant パターンで、一覧で最初に処理されたリンクか（prerender ごと
            prefetch され、商品情報まで即座に表示される）
          </li>
          <li>prefetch が終わる前にクリックしたか（App Shell の表示になる）</li>
          <li>
            リンクが画面内に入ったか（画面外のリンクは prefetch されない）
          </li>
        </ul>
      </div>
    </div>
  );
}
