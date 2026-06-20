---
title: "リダイレクト"
sidebar:
  order: 9
---

GinはHTTPリダイレクト（クライアントを異なるURLに送信する）とルーターリダイレクト（クライアントへのラウンドトリップなしにリクエストを内部的に別のハンドラに転送する）の両方をサポートしています。

## HTTPリダイレクト

`c.Redirect` を適切なHTTPステータスコードと共に使用して、クライアントをリダイレクトします：

- **301 (`http.StatusMovedPermanently`)** -- リソースが恒久的に移動しました。ブラウザと検索エンジンはキャッシュを更新します。
- **302 (`http.StatusFound`)** -- 一時的なリダイレクト。ブラウザは従いますが、新しいURLをキャッシュしません。
- **307 (`http.StatusTemporaryRedirect`)** -- 302と同様ですが、ブラウザは元のHTTPメソッドを保持する必要があります（POSTリダイレクトに便利です）。
- **308 (`http.StatusPermanentRedirect`)** -- 301と同様ですが、ブラウザは元のHTTPメソッドを保持する必要があります。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## テスト

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
POSTハンドラからリダイレクトする場合は、`301` の代わりに `302` または `307` を使用してください。`301` リダイレクトは一部のブラウザでメソッドがPOSTからGETに変更される可能性があり、予期しない動作につながることがあります。
:::

:::tip
`router.HandleContext(c)` による内部リダイレクトは、クライアントにリダイレクトレスポンスを送信しません。リクエストはサーバー内で再ルーティングされるため、より高速でクライアントからは見えません。
:::

## 関連項目

- [ルートのグループ化](/ja/docs/routing/grouping-routes/)
