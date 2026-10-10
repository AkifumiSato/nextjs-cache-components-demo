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
          済みなので、返ってくるのはその URL の prerender（商品情報入り）です。
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
      <Note summary="Q. レコメンドはキャッシュしているのに、なぜ prefetch されないの？">
        <p>
          どちらのパターンも、レコメンドは await connection()
          のあとで取得しています。connection()
          より下はリクエスト時にしか実行されないため、build 時の prerender
          にも、App Shell・リンク単位の prefetch にも含まれません。
        </p>
        <p>
          getRecommendations は use cache
          なので、結果はサーバーにキャッシュされます。遷移のたびに描画されますが、キャッシュが有効な間はデータが即座に返ります。2
          秒待つのは、初回と、20
          秒以上アクセスがなくキャッシュが切れたときです。
        </p>
      </Note>
      <Note summary="Q. instant と instant + prefetch は何が違うの？">
        <p>
          リンクに prefetch={"{true}"}{" "}
          を付けているかどうかと、在庫をキャッシュしているかどうかです。
        </p>
        <p>
          通常の Link が prefetch するのは App Shell だけで、URL
          に依存する商品情報や在庫は含まれません。prefetch={"{true}"}{" "}
          を付けると、リンクごとにその URL
          をサーバーで描画し、キャッシュ済みのデータまでを prefetch
          に含めます。キャッシュしていない読み込み（connection()
          の後のレコメンドなど）の手前で止まり、そこは Suspense の fallback
          になります。
        </p>
        <p>
          在庫は use cache（10 秒）にしているので、リンク単位の prefetch
          に含まれます。表示中のリンクごとに prefetch が走っても、在庫 API
          は商品ごとに 10 秒に 1 回程度しか呼ばれません。
        </p>
      </Note>
      <Note summary="Q. instant + prefetch で、遷移後に在庫の取得時刻が変わることがあるのはなぜ？">
        <p>
          レコメンドが遷移時の取得なので、遷移のたびにサーバーで page
          全体が描画し直されます。クライアントは prefetch
          済みの内容をすぐに表示し、遷移の応答が届くとそれで置き換えます。
        </p>
        <p>
          このとき在庫も描画し直されるため、サーバー側のキャッシュ（10
          秒）が切れていれば最新の値に置き換わります。クリック直後に在庫が表示されていれば、prefetch
          は効いています。
        </p>
      </Note>
      <Note summary="Q. prefetch パターンだけ generateStaticParams がないのはなぜ？">
        <p>
          build 時に prerender すると、リンク単位の prefetch がその prerender
          から返されることがあります。在庫はキャッシュの寿命が短い（expire が 5
          分未満）ため prerender には含まれず、prefetch にも入らなくなります。
        </p>
        <p>
          generateStaticParams がなければ、リンク単位の prefetch
          は実行時に描画され、商品情報・在庫までを解決します。
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
