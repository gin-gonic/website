---
title: "カスタムリカバリの挙動"
sidebar:
  order: 4
---

Ginの組み込み`gin.Recovery()`ミドルウェアは、リクエスト処理中に発生したあらゆるpanicをキャッチし、`500`レスポンスを書き込み、サーバーを稼働し続けます。リカバリ時の挙動を制御したい場合 -- 例えばpanicをユーザーに通知したり、データベースに保存したり、エラートラッキングサービスに送信したりする場合 -- は、代わりに`gin.CustomRecovery()`を使用します。

`gin.CustomRecovery()`は、`func(c *gin.Context, recovered any)`というシグネチャを持つハンドラを受け取ります。`recovered`の値は、`panic()`に渡されたものです。ハンドラ内でどのように応答するかを決定し、その後`c.AbortWithStatus()`（または別のabortメソッド）を呼び出して、残りのハンドラがスキップされるようにします。

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // デフォルトではミドルウェアなしのルーターを作成
  r := gin.New()

  // グローバルミドルウェア
  // GIN_MODE=releaseを設定していても、Loggerミドルウェアはgin.DefaultWriterにログを書き込みます。
  // デフォルトでは gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recoveryミドルウェアはあらゆるpanicからリカバリし、panicがあった場合は500を書き込みます。
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // 文字列でpanic -- カスタムミドルウェアはこれをデータベースに保存したり、ユーザーに通知したりできます
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  r.Run(":8080")
}
```

## テスト

```bash
# panicをトリガー；カスタムリカバリハンドラがメッセージを返します
curl http://localhost:8080/panic
# => error: foo

# 通常のリクエストは引き続き動作します
curl http://localhost:8080/
# => ohai
```

## 関連項目

- [カスタムミドルウェア](/ja/docs/middleware/custom-middleware/)
- [デフォルトでミドルウェアなしの空のGin](/ja/docs/middleware/without-middleware/)
- [エラーハンドリングミドルウェア](/ja/docs/middleware/error-handling-middleware/)
