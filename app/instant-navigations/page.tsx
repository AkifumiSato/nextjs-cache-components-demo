import Link from "next/link";
import { Note } from "./_components/note";
import { PendingHint } from "./_components/pending-hint";
import { RouteTag } from "./_components/route-tag";

export default function InstantNavigationsPage() {
  return (
    <div>
      <div className="text-neutral-400 mb-8">
        <p>
          Cache Components と Partial Prefetching（
          <code>partialPrefetching: true</code>）を有効にした状態で、Link の
          prefetch 指定と instant
          設定の違いによって、遷移時の表示がどう変わるかを比べるデモです。商品ページはどれも、商品名とキャッシュされた価格（use
          cache）、毎リクエスト取得するレビュー（2 秒）・おすすめ（3
          秒）を表示します。
        </p>
      </div>

      <h2 className="text-lg font-semibold text-neutral-100 mb-1">デモ</h2>
      <div className="text-sm text-neutral-500 mb-4 space-y-1">
        <p>
          タグごとに 2
          商品を用意しています。商品をクリックして、遷移直後の表示を比べてください。
        </p>
        <p>
          prefetch は dev では行われないため、
          <code>next build &amp;&amp; next start</code>{" "}
          で確認してください。localhost では差が小さいので、DevTools の Network
          throttling（Slow 4G など）を使うと見やすくなります。
        </p>
      </div>

      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-neutral-500">
            <tr className="border-b border-neutral-800">
              <th className="py-2 pr-4 font-normal">タグ</th>
              <th className="py-2 pr-4 font-normal">prefetch されるもの</th>
              <th className="py-2 pr-4 font-normal">クリック直後</th>
              <th className="py-2 font-normal">レビュー・おすすめ</th>
            </tr>
          </thead>
          <tbody className="text-neutral-300">
            <tr className="border-b border-neutral-800/60">
              <td className="py-2 pr-4">
                <RouteTag variant="prefetch-true" />
              </td>
              <td className="py-2 pr-4">App Shell ＋ 価格</td>
              <td className="py-2 pr-4">商品名・価格まで表示</td>
              <td className="py-2">遷移後に Streaming</td>
            </tr>
            <tr className="border-b border-neutral-800/60">
              <td className="py-2 pr-4">
                <RouteTag variant="app-shell" />
              </td>
              <td className="py-2 pr-4">App Shell</td>
              <td className="py-2 pr-4">
                skeleton（一覧の最初のリンクは中身まで）
              </td>
              <td className="py-2">遷移後に Streaming</td>
            </tr>
            <tr className="border-b border-neutral-800/60">
              <td className="py-2 pr-4">
                <RouteTag variant="no-prefetch" />
              </td>
              <td className="py-2 pr-4">なし</td>
              <td className="py-2 pr-4">切り替わらない（応答後に skeleton）</td>
              <td className="py-2">遷移後に Streaming</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">
                <RouteTag variant="blocking" />
              </td>
              <td className="py-2 pr-4">App Shell（中身はほぼ空）</td>
              <td className="py-2 pr-4">切り替わらない（約 3 秒）</td>
              <td className="py-2">全データが揃ってから一括表示</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-12 space-y-4">
        <section className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40">
          <RouteTag variant="prefetch-true" />
          <p className="text-sm text-neutral-400 mt-2 mb-3">
            リンクに prefetch={"{true}"} を指定。App Shell に加えて、params
            に依存するキャッシュ済みの価格まで事前に取得するため、prefetch
            が完了していればクリックした瞬間に商品名・価格まで表示されます。
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              <Link
                href="/instant-navigations/instant-prefetch/1"
                prefetch={true}
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                メカニカルキーボード <PendingHint />
              </Link>
            </li>
            <li>
              <Link
                href="/instant-navigations/instant-prefetch/2"
                prefetch={true}
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                ワイヤレスマウス <PendingHint />
              </Link>
            </li>
          </ul>
        </section>

        <section className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40">
          <RouteTag variant="app-shell" />
          <p className="text-sm text-neutral-400 mt-2 mb-3">
            デフォルトの Link。ルート共通の App Shell（loading.tsx の
            skeleton）だけを prefetch するため、クリックするとまず skeleton
            が表示され、商品名・価格は遷移後に届きます。ただし一覧ページの 4K
            モニター（最初のリンク）だけは、中身まで即座に表示されます。
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              <Link
                href="/instant-navigations/instant-app-shell/3"
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                4K モニター <PendingHint />
              </Link>
            </li>
            <li>
              <Link
                href="/instant-navigations/instant-app-shell/4"
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                USB-C ハブ <PendingHint />
              </Link>
            </li>
          </ul>
        </section>

        <section className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40">
          <RouteTag variant="no-prefetch" />
          <p className="text-sm text-neutral-400 mt-2 mb-3">
            リンクに prefetch={"{false}"} を指定。何も prefetch
            しないため、クリックしてもサーバーの応答が届くまで画面は切り替わらず、その後
            skeleton、続いて中身が表示されます。
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              <Link
                href="/instant-navigations/instant-no-prefetch/5"
                prefetch={false}
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                ノイズキャンセリングヘッドホン <PendingHint />
              </Link>
            </li>
            <li>
              <Link
                href="/instant-navigations/instant-no-prefetch/6"
                prefetch={false}
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                スタンディングデスク <PendingHint />
              </Link>
            </li>
          </ul>
        </section>

        <section className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/40">
          <RouteTag variant="blocking" />
          <p className="text-sm text-neutral-400 mt-2 mb-3">
            loading.tsx も Suspense もなく全データを await
            するため、すべて揃うまで（約 3 秒）画面が切り替わりません。instant =
            false は検証の insight を止めるだけで、挙動は変えません。
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              <Link
                href="/instant-navigations/blocking/7"
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                Web カメラ <PendingHint />
              </Link>
            </li>
            <li>
              <Link
                href="/instant-navigations/blocking/8"
                className="flex items-center justify-between gap-2 p-4 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800 transition-colors"
              >
                モニターアーム <PendingHint />
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <h2 className="text-lg font-semibold text-neutral-100 mb-1">
        よくある疑問
      </h2>
      <p className="text-sm text-neutral-500 mb-3">
        デモを触っていて気になりそうな点の背景です。必要に応じて開いてください。
      </p>
      <div className="space-y-2">
        <Note summary="Q. なぜ同じタグの 2 商品で挙動が違うの？">
          <p>
            App Shell の prefetch はルートごとに 1
            本だけで、一覧ページで最初に処理されたリンクの
            URL（メカニカルキーボード、4K モニター）に対して飛びます。この URL
            は generateStaticParams で prerender 済みなので、返ってくるのはその
            URL の prerender（商品名・価格入り）です。
          </p>
          <p>
            クライアントはここから App Shell
            を取り出して同じルートの他のリンクと共有しつつ、その URL
            の中身も保持します。そのため prefetch={"{true}"}{" "}
            がなくても、一覧ページの最初のリンクだけは中身まで即座に表示されます。商品ページのおすすめから遷移した場合は、どちらの商品も
            skeleton から表示されます。
          </p>
          <p className="text-neutral-500">
            Next.js 16.3.6 で計測した挙動で、docs には記載がありません。
          </p>
        </Note>
        <Note summary="Q. App Shell には何が含まれるの？">
          <p>
            params など URL
            のデータに依存しない部分です。このデモでは、各ルートの
            layout（タグと説明）と loading.tsx の skeleton が該当します。stale
            が 5 分以上のキャッシュ済みデータも含まれますが、価格は params
            に依存するため含まれません。
          </p>
        </Note>
        <Note summary="Q. prefetch={true} ならレビューやおすすめも先に取得される？">
          <p>
            されません。事前に解決されるのは params
            と、それに依存するキャッシュ済みのデータ（価格）までです。毎リクエスト取得するデータは、遷移後に
            Streaming されます。
          </p>
          <p>
            また、表示中のリンクごとにサーバー処理が走るため、リンクの多い画面ではコストに注意が必要です。
          </p>
        </Note>
        <Note summary="Q. 価格の生成時刻が遷移後に変わるのはなぜ？">
          <p>
            遷移すると、まず prefetch
            済みの内容で表示され、その後、遷移時のリクエストで実行時にレンダリングされたページに置き換わります。build
            時の prerender
            が表示されるのは、直接アクセスしたときと、一覧ページの最初のリンクへ遷移して置き換わるまでの間だけです。prefetch=
            {"{true}"} のリンク単位の prefetch や prefetch={"{false}"}{" "}
            の遷移も、実行時にレンダリングされます。
          </p>
          <p>
            実行時のキャッシュ（use cache のデフォルトはプロセスごとの in-memory
            LRU）には build
            時の結果が入っていないため、サーバー起動後の初回だけ価格の計算に 1
            秒かかります。prefetch が終わる前にクリックすると skeleton
            が表示されるのはこのためです。
          </p>
        </Note>
        <Note summary="Q. どの prefetch が飛んだかはどう見分ける？">
          <p>
            RSC リクエストはどれも URL が <code>?_rsc=</code>{" "}
            付きの同じ形なので、Request Headers で見分けます。
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <code>next-router-segment-prefetch: /_tree</code>：ルートの構造
            </li>
            <li>
              <code>next-router-segment-prefetch</code> に <code>__PAGE__</code>{" "}
              を含む：App Shell（または最初のリンクの prerender）
            </li>
            <li>
              <code>next-router-prefetch: 2</code>：prefetch={"{true}"}{" "}
              のリンク単位の prefetch
            </li>
            <li>prefetch 系のヘッダーなし：遷移時のリクエスト</li>
          </ul>
        </Note>
      </div>
    </div>
  );
}
