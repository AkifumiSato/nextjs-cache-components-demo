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
      <Note summary="Q. instant と instant + prefetch は何が違うの？">
        <p>
          ページは同じコンポーネントで、違いはリンクに prefetch={"{true}"}{" "}
          を付けているかと、在庫の手前で await navigation() と await prefetch()
          のどちらを呼んでいるかです。
        </p>
        <p>
          通常の Link が prefetch するのは App Shell だけで、URL
          に依存する商品情報や在庫は含まれません。prefetch={"{true}"}{" "}
          を付けると、リンクごとにその URL
          をサーバーで描画し、キャッシュ済みのデータまでを prefetch
          に含めます。connection() の後のレコメンドの手前で止まり、そこは
          Suspense の fallback になります。
        </p>
        <p>
          navigation() より下はリンク単位の prefetch
          でも実行されず、遷移したときに解決されます。prefetch() より下は App
          Shell には入りませんが、リンク単位の prefetch で解決されます。在庫は
          params に依存するので、どちらの関数がなくても App Shell
          には入りません。2
          つの関数は、在庫をどの段階で解決するかをコードに明示し、リンクの
          prefetch 指定が変わってもその意図を保つためのものです。
        </p>
        <p>
          在庫はどちらのパターンでもキャッシュ（10
          秒ごとに更新）しているので、表示中のリンクごとに prefetch
          が走っても、在庫 API は商品ごとに 10 秒に 1 回程度しか呼ばれません。
        </p>
      </Note>
      <Note summary="Q. generateStaticParams を使わないのはなぜ？">
        <p>
          build 時の prerender には、navigation() や prefetch()
          の下も含まれます。instant では一覧で最初に処理されたリンクが、App
          Shell の代わりにその URL の prerender ごと prefetch
          されるため、在庫まで遷移前に届いてしまいます。
        </p>
        <p>
          generateStaticParams がなければ prerender は App Shell
          だけになり、在庫が解決される段階をリンクの prefetch 指定と 2
          つの関数で決められます。
        </p>
      </Note>
      <Note summary="Q. レコメンドはキャッシュしているのに、なぜ prefetch されないの？">
        <p>
          レコメンドは await connection() のあとで取得しています。connection()
          より下はリクエスト時にしか実行されないため、build 時の prerender
          にも、App Shell・リンク単位の prefetch にも含まれません。
        </p>
        <p>
          getRecommendations は use cache
          なので、結果はサーバーにキャッシュされます。遷移のたびに描画されますが、キャッシュが有効な間はデータが即座に返ります。2
          秒待つのは、初回と、5 分以上アクセスがなくキャッシュが切れたときです。
        </p>
      </Note>
      <Note summary="Q. instant + prefetch で、遷移後に在庫の取得時刻が変わることがあるのはなぜ？">
        <p>
          レコメンドが遷移時の取得なので、遷移のたびにサーバーで page
          全体が描画し直されます。クライアントは prefetch
          済みの内容をすぐに表示し、遷移の応答が届くとそれで置き換えます。
        </p>
        <p>
          このとき在庫も描画し直されるため、prefetch から 10
          秒以上経っていれば新しい値に置き換わります。クリック直後に在庫が表示されていれば、prefetch
          は効いています。
        </p>
      </Note>
      <Note summary="Q. 2 回目以降はすぐに表示されるのはなぜ？">
        <p>
          データはどれもサーバーでキャッシュしているので、一度取得した商品は 2
          回目以降キャッシュから返ります。初回の遷移を見比べたいときは、一覧の「キャッシュをすべてクリア」を押してください。
        </p>
        <p>
          このボタンは Server Action で updateTag
          を呼び、商品情報・レコメンド・在庫のキャッシュをすぐに失効させます。Server
          Action
          ではクライアントのルーターキャッシュもクリアされるので、prefetch
          もやり直されます。
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
            を含む：App Shell
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
