---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON`は**JSONハイジャック**として知られる脆弱性クラスから保護します。古いブラウザ（主にInternet Explorer 9以前）では、悪意のあるページが被害者のJSON APIエンドポイントを指す`<script>`タグを含めることができました。そのエンドポイントがトップレベルのJSON配列（例：`["secret","data"]`）を返した場合、ブラウザはそれをJavaScriptとして実行していました。`Array`コンストラクタをオーバーライドすることで、攻撃者はパースされた値を傍受し、機密データをサードパーティのサーバーに漏洩させることができました。

**SecureJSONの防止方法：**

レスポンスデータがJSON配列の場合、`SecureJSON`はレスポンスボディにパース不可能なプレフィックス（デフォルトでは`while(1);`）を付加します。これにより、レスポンスが`<script>`タグ経由で読み込まれた場合にブラウザのJavaScriptエンジンが無限ループに入り、データへのアクセスが防止されます。正当なAPI利用者（`fetch`、`XMLHttpRequest`、またはその他のHTTPクライアントを使用）はレスポンスボディを直接読み取り、パース前にプレフィックスを除去するだけで済みます。

GoogleのAPIは`)]}'\n`で、Facebookは`for(;;);`で同様の手法を使用しています。プレフィックスは`router.SecureJsonPrefix()`でカスタマイズできます。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 独自のSecure JSONプレフィックスを使用することもできます
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // 出力: while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

:::note
モダンブラウザではこの脆弱性は修正されているため、`SecureJSON`は主にレガシーブラウザのサポートが必要な場合や、セキュリティポリシーで多層防御が求められる場合に関係します。ほとんどの新しいAPIでは、標準の`c.JSON()`で十分です。
:::
