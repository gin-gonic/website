---
title: "エラーハンドリングミドルウェア"
sidebar:
  order: 4
---

典型的なRESTfulアプリケーションでは、あらゆるルートでエラーが発生する可能性があります。無効な入力、データベースの障害、未認証のアクセス、内部バグなどです。各ハンドラで個別にエラーを処理すると、繰り返しのコードと一貫性のないレスポンスにつながります。

集中型のエラーハンドリングミドルウェアは、各リクエストの後に実行され、`c.Error(err)` を介してGinコンテキストに追加されたエラーを確認することで、この問題を解決します。エラーが見つかった場合、適切なステータスコードと構造化されたJSONレスポンスを送信します。

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## テスト

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
このパターンを拡張して、特定のエラータイプを異なるHTTPステータスコードにマッピングしたり、レスポンスを返す前に外部サービスにエラーをログ記録したりできます。
:::

## 関連項目

- [カスタムミドルウェア](/ja/docs/middleware/custom-middleware/)
- [ミドルウェアの使用](/ja/docs/middleware/using-middleware/)
