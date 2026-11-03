---
title: "ミドルウェアの使用"
sidebar:
  order: 2
---

Ginのミドルウェアは、ルートハンドラの前（およびオプションで後）に実行される関数です。ロギング、認証、エラーリカバリ、リクエストの修正などの横断的関心事に使用されます。

Ginは3つのレベルのミドルウェア登録をサポートしています：

- **グローバルミドルウェア** -- ルーター内のすべてのルートに適用されます。`router.Use()`で登録します。ロギングやpanicリカバリなど普遍的に適用される関心事に適しています。
- **グループミドルウェア** -- ルートグループ内のすべてのルートに適用されます。`group.Use()`で登録します。ルートのサブセット（例：すべての`/admin/*`ルート）に認証や認可を適用する場合に便利です。
- **ルートごとのミドルウェア** -- 単一のルートにのみ適用されます。`router.GET()`、`router.POST()`などの追加引数として渡します。カスタムレート制限や入力バリデーションなど、ルート固有のロジックに便利です。

**実行順序：** ミドルウェア関数は登録された順序で実行されます。`c.Next()`を呼び出すと残りのハンドラが実行され、戻った後に現在のミドルウェアの実行が再開されます。これにより、後続のハンドラの実行前後にコードを実行できます。ミドルウェアがこのように後続のハンドラを包む場合、後処理は逆順（LIFO）で実行されます。

ミドルウェアが`c.Next()`を呼び出さずに戻っても、コンテキストが中断されていなければ、後続のミドルウェアとハンドラは実行されます。未実行のハンドラをスキップするには、`c.Abort()`または`AbortWithStatus*`メソッドを呼び出してください。中断しても現在のミドルウェア関数は停止しないため、その関数の残りのコードの実行も停止したい場合は`return`を使用してください。

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // デフォルトではミドルウェアなしのルーターを作成
  router := gin.New()

  // グローバルミドルウェア
  // LoggerミドルウェアはGIN_MODE=releaseに設定しても、gin.DefaultWriterにログを書き込みます。
  // デフォルトではgin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recoveryミドルウェアはpanicからリカバリし、発生した場合は500を書き込みます。
  router.Use(gin.Recovery())

  // ルートごとのミドルウェア、好きなだけ追加できます。
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // 認可グループ
  // authorized := router.Group("/", AuthRequired())
  // 上記と全く同じ：
  authorized := router.Group("/")
  // グループごとのミドルウェア！この場合、カスタム作成の
  // AuthRequired()ミドルウェアを"authorized"グループでのみ使用します。
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // ネストされたグループ
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

:::note
`gin.Default()`は`Logger`と`Recovery`ミドルウェアが既に登録されたルーターを作成する便利な関数です。ミドルウェアなしの素のルーターが必要な場合は、上記のように`gin.New()`を使用し、必要なミドルウェアのみを追加してください。
:::
