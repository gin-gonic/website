---
title: "パス内のパラメータ"
sidebar:
  order: 2
---

GinはURLから直接値をキャプチャできる2種類のパスパラメータをサポートしています：

- **`:name`** -- 単一のパスセグメントにマッチします。例えば、`/user/:name` は `/user/john` にマッチしますが、`/user/` や `/user` にはマッチ**しません**。
- **`*action`** -- プレフィックス以降のスラッシュを含むすべてにマッチします。例えば、`/user/:name/*action` は `/user/john/send` や `/user/john/` にマッチします。キャプチャされた値には先頭の `/` が含まれます。

ハンドラ内でパスパラメータの値を取得するには `c.Param("name")` を使用します。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## テスト

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
ワイルドカード `*action` の値には常に先頭の `/` が含まれます。上の例では、`c.Param("action")` は `send` ではなく `/send` を返します。
:::

:::caution
同じパスの深さで競合する `/user/:name` と `/user/:name/*action` の両方を定義することはできません。あいまいなルートが検出された場合、Ginは起動時にパニックを起こします。
:::

## 関連項目

- [クエリ文字列パラメータ](/ja/docs/routing/querystring-param/)
- [クエリとポストフォーム](/ja/docs/routing/query-and-post-form/)
