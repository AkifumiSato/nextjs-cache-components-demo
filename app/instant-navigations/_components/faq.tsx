import { Note } from "./note";

export function Faq() {
  return (
    <div className="space-y-2">
      <Note summary="Q. App Shell には何が含まれるの？">
        <p>
          params などの URL
          データに依存しない部分です。同じルートへのリンクはすべて同じ App Shell
          を共有するため、商品ごとに異なる商品情報は含まれません。キャッシュ済みのデータも
          stale が 5 分以上なら含まれますが、params
          に依存する場合は含まれません。
        </p>
        <p>
          このデモでは page で params を await せず、Suspense
          の内側のコンポーネントで読んでいます。そのため、レイアウトに加えて
          レコメンドの見出しや skeleton まで App Shell に入ります。page の先頭で
          params を await すると、App Shell は loading.tsx（なければ親の
          Suspense）の fallback までになります。
        </p>
      </Note>
      <Note summary="Q. legacy パターンはなぜ画面が切り替わらないの？">
        <p>
          page が Suspense なしで全データを await
          しているため、表示できる中間状態がありません。App Shell
          としてはレイアウトしか prefetch
          できず、サーバーの応答が揃うまで遷移が止まります。
        </p>
        <p>
          Cache Components では本来この構成は Instant Insights
          の検証で指摘されます。export const instant = false
          は検証を止めるだけで、挙動は変えません。
        </p>
      </Note>
      <Note summary="Q. instant パターンの 2 商品で挙動が違うのはなぜ？">
        <p>
          App Shell の prefetch はルートごとに 1
          本だけで、一覧ページで最初に処理されたリンクの URL
          に対して飛びます。この URL は generateStaticParams で prerender
          済みなので、返ってくるのはその URL の
          prerender（商品情報・レコメンド入り）です。
        </p>
        <p>
          クライアントはここから App Shell
          を取り出して同じルートの他のリンクと共有しつつ、その URL
          の中身も保持します。そのため prefetch={"{true}"}{" "}
          がなくても、最初のリンクだけは商品情報まで即座に表示されます。
        </p>
        <p className="text-neutral-500">
          Next.js 16.4.0 で計測した挙動で、docs には記載がありません。
        </p>
      </Note>
      <Note summary="Q. レコメンドはキャッシュしているのに、なぜ instant パターンでは prefetch されないの？">
        <p>
          instant パターンでは、レコメンドを await connection()
          のあとで取得しています。connection()
          より下はリクエスト時にしか実行されないため、build 時の prerender
          にも、App Shell・リンク単位の prefetch にも含まれません。
        </p>
        <p>
          getRecommendations は use cache
          なので、結果はサーバーにキャッシュされます。2
          秒かかるのは商品ごとに初回だけで、以降は遷移のたびに描画されますが、データはキャッシュから即座に返ります。
        </p>
      </Note>
      <Note summary="Q. prefetch() は何をしているの？">
        <p>
          await prefetch() より下の処理を App Shell から外し、リンク単位の
          prefetch か遷移時に実行させます。App Shell には最寄りの Suspense の
          fallback（レコメンド・在庫の skeleton）が入ります。
        </p>
        <p>
          connection()
          との違いは、下の処理をリクエスト依存にしない点です。そのため prefetch=
          {"{true}"} のリンク単位の prefetch
          で、レコメンドと在庫をクリック前に取得できます。
        </p>
        <p>
          在庫は use cache（10 秒）を付けているので、表示中のリンクごとに
          prefetch が走っても、在庫 API は商品ごとに 10 秒に 1
          回程度しか呼ばれません。
        </p>
      </Note>
      <Note summary="Q. instant では在庫・レコメンドが遷移時に取得されるのはなぜ？">
        <p>
          instant パターンでは、レコメンドと在庫を await connection()
          のあとで取得しています。connection()
          より下はリクエスト時にしか実行されないため、App Shell・リンク単位の
          prefetch には含まれず、遷移時に Streaming されます。
        </p>
      </Note>
      <Note summary="Q. prefetch パターンだけ generateStaticParams がないのはなぜ？">
        <p>
          prefetch() が効くのは実行時のレンダリングだけです。build 時の
          prerender には prefetch() の下のレコメンド・在庫も含まれ、build
          時に生成されてしまいます。
        </p>
        <p>
          generateStaticParams がなければ、リンク単位の prefetch
          は実行時にレンダリングされ、商品情報・レコメンド・在庫までを解決します。
        </p>
      </Note>
      <Note summary="Q. 商品情報の生成時刻が build 時刻のままなのはなぜ？">
        <p>
          instant パターンでは、generateStaticParams で prerender した URL の
          build 時の use cache
          の結果が実行時にも使われます。遷移時のリクエストは実行時にレンダリングされますが、cacheLife(&quot;hours&quot;)
          の revalidate（1 時間）を過ぎるまでは、build 時の結果が返ります。
        </p>
        <p>
          レコメンドは prerender
          に含まれないため、商品ごとに最初にリクエストされた時刻になります。
        </p>
        <p className="text-neutral-500">
          Next.js 16.4.0 の next start で計測した挙動です。
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
  );
}
