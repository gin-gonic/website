---
title: "JSONP"
sidebar:
  order: 3
---

JSONP（JSON with Padding）は、CORSサポート以前のブラウザからクロスドメインリクエストを行うための手法です。JSONレスポンスをJavaScript関数呼び出しでラップすることで機能します。ブラウザは同一オリジンポリシーの対象外である`<script>`タグ経由でレスポンスを読み込み、ラッピング関数がデータを引数として実行されます。

`c.JSONP()`を呼び出すと、Ginは`callback`クエリパラメータをチェックします。存在する場合、レスポンスボディは`callbackName({"foo":"bar"})`としてラップされ、`Content-Type`は`application/javascript`になります。コールバックが提供されない場合、レスポンスは標準の`c.JSON()`呼び出しと同じ動作になります。

:::note
JSONPはレガシーな手法です。モダンなアプリケーションでは、代わりに[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)を使用してください。CORSはより安全で、すべてのHTTPメソッド（GETだけでなく）をサポートし、レスポンスをコールバックでラップする必要がありません。JSONPは、非常に古いブラウザをサポートする必要がある場合や、JSONPを必要とするサードパーティシステムとの統合時にのみ使用してください。
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // コールバック名はクエリ文字列から読み取られます。例：
    // GET /JSONP?callback=x
    // 出力: x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

curlでテストして、JSONPとプレーンJSONレスポンスの違いを確認します：

```sh
# コールバックあり -- JavaScriptを返す
curl "http://localhost:8080/JSONP?callback=handleData"
# 出力: handleData({"foo":"bar"});

# コールバックなし -- プレーンJSONを返す
curl "http://localhost:8080/JSONP"
# 出力: {"foo":"bar"}
```

:::caution[セキュリティ上の考慮事項]
callbackパラメータが適切にサニタイズされていない場合、JSONPエンドポイントはXSS攻撃に脆弱になる可能性があります。`alert(document.cookie)//`のような悪意のあるコールバック値は任意のJavaScriptを注入できます。Ginはコールバック名をサニタイズし、注入に使用される可能性のある文字を除去することでこれを軽減しています。ただし、Web上のあらゆるページが`<script>`タグ経由でJSONPエンドポイントを読み込めるため、JSONPエンドポイントは機密性のない読み取り専用データに限定すべきです。
:::

## 関連項目

- [XML/JSON/YAML/ProtoBufレンダリング](/ja/docs/rendering/rendering/)
- [SecureJSON](/ja/docs/rendering/secure-json/)
- [AsciiJSON](/ja/docs/rendering/ascii-json/)
- [PureJSON](/ja/docs/rendering/pure-json/)
