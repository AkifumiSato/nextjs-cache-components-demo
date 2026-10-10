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
          がなくても、最初のリンクだけは中身まで即座に表示されます。use cache:
          remote cache パターンも同じ構成なので同様です。
        </p>
        <p className="text-neutral-500">
          Next.js 16.4.0 で計測した挙動で、docs には記載がありません。
        </p>
      </Note>
      <Note summary="Q. navigation() は何をしているの？">
        <p>
          await navigation() より下の処理を、App Shell と prefetch=
          {"{true}"} のリンク単位の prefetch
          から外し、実際に遷移したときに実行させます。prefetch
          の時点では最寄りの Suspense の fallback（在庫の skeleton）が入ります。
        </p>
        <p>
          prefetch={"{true}"}{" "}
          は表示中のリンクごとにサーバー処理が走ります。在庫を prefetch
          に含めると、クリックされないリンクのためにも在庫 API
          を呼ぶことになり、prefetch 時点の在庫が表示されることにもなります。
        </p>
        <p>
          connection()
          との違いは、下の処理をリクエスト依存にしない点です。そのため在庫は use
          cache
          でキャッシュでき、一度取得すれば次の遷移ではキャッシュから返ります。逆に、キャッシュしないデータは元から
          prefetch に含まれないため、navigation() は不要です。
        </p>
      </Note>
      <Note summary="Q. prefetch パターンだけ generateStaticParams がないのはなぜ？">
        <p>
          navigation() が効くのは実行時のレンダリングだけです。build 時の
          prerender には navigation() の下の在庫も含まれ、リンク単位の prefetch
          がその prerender から返されることがあるため、在庫まで prefetch
          されてしまいます。
        </p>
        <p>
          generateStaticParams がなければ、リンク単位の prefetch
          は実行時にレンダリングされ、params
          に依存するキャッシュ済みの商品情報・レコメンドまでを解決し、在庫の手前で止まります。
        </p>
      </Note>
      <Note summary="Q. use cache ではなく use cache: remote を使うのはなぜ？">
        <p>
          在庫は鮮度を優先して connection()
          で毎リクエスト描画する動的コンテンツにしています。use cache
          のデフォルトはプロセスごとの in-memory LRU
          なので、サーバーレス環境ではインスタンス間で共有されず、動的コンテンツ内ではヒット率が低くなりがちです。
        </p>
        <p>
          use cache: remote は cacheHandlers の remote に設定した handler
          に保存され、全インスタンスで共有されます。在庫 API
          へのアクセスを、インスタンス数によらず 5 分に 1 回程度に抑えられます。
        </p>
        <p className="text-neutral-500">
          このリポジトリでは remote の handler を設定していないため、ローカルの
          next start では use cache と同じ in-memory LRU
          として動きます。サーバーを再起動するとキャッシュは消えます。
        </p>
      </Note>
      <Note summary="Q. 商品情報・レコメンドの生成時刻が build 時刻のままなのはなぜ？">
        <p>
          generateStaticParams で prerender した URL では、build 時の use cache
          の結果が実行時にも使われます。遷移時のリクエストは実行時にレンダリングされますが、cacheLife(&quot;hours&quot;)
          の revalidate（1 時間）を過ぎるまでは、build 時の結果が返ります。
        </p>
        <p>
          prefetch パターンは prerender されていないため、最初にリンク単位の
          prefetch が走った時刻になります。
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
