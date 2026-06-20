---
title: "カスタムミドルウェア"
sidebar:
  order: 3
---

Ginのミドルウェアは`gin.HandlerFunc`を返す関数です。ミドルウェアはメインハンドラの前および/または後に実行されるため、ロギング、認証、エラーハンドリング、その他の横断的関心事に便利です。

### ミドルウェアの実行フロー

ミドルウェア関数は`c.Next()`の呼び出しによって2つのフェーズに分かれます：

- **`c.Next()`の前** -- ここのコードはリクエストがメインハンドラに到達する前に実行されます。開始時刻の記録、トークンのバリデーション、`c.Set()`によるコンテキスト値の設定などのセットアップタスクにこのフェーズを使用します。
- **`c.Next()`** -- チェーン内の次のハンドラ（別のミドルウェアまたは最終ルートハンドラ）を呼び出します。すべての下流ハンドラが完了するまで、ここで実行が一時停止します。
- **`c.Next()`の後** -- ここのコードはメインハンドラが完了した後に実行されます。クリーンアップ、レスポンスステータスのロギング、レイテンシの計測にこのフェーズを使用します。

チェーンを完全に停止したい場合（例：認証が失敗した場合）は、`c.Next()`の代わりに`c.Abort()`を呼び出します。これにより残りのハンドラの実行が防止されます。レスポンスと組み合わせることもできます。例：`c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`。

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // サンプル変数を設定
    c.Set("example", "12345")

    // リクエスト前

    c.Next()

    // リクエスト後
    latency := time.Since(t)
    log.Print(latency)

    // 送信中のステータスにアクセス
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // "12345"と出力されます
    log.Println(example)
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  r.Run(":8080")
}
```

### テスト

```bash
curl http://localhost:8080/test
```

`Logger`ミドルウェアを通過するすべてのリクエストについて、サーバーログにリクエストのレイテンシとHTTPステータスコードが表示されます。

## 関連項目

- [エラーハンドリングミドルウェア](/ja/docs/middleware/error-handling-middleware/)
- [ミドルウェアの使用](/ja/docs/middleware/using-middleware/)
