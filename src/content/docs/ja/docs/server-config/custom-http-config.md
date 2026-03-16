---
title: "カスタムHTTP設定"
sidebar:
  order: 1
---

デフォルトでは、`router.Run()` は基本的なHTTPサーバーを起動します。本番環境では、タイムアウト、ヘッダー制限、TLS設定をカスタマイズする必要がある場合があります。独自の `http.Server` を作成し、Ginルーターを `Handler` として渡すことでこれを行えます。

## 基本的な使い方

Ginルーターを直接 `http.ListenAndServe` に渡します：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## カスタムサーバー設定

`http.Server` 構造体を作成して、読み取り/書き込みタイムアウトやその他のオプションを設定します：

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## テスト

```sh
curl http://localhost:8080/ping
# Output: pong
```

## 関連項目

- [グレースフルリスタートまたは停止](/ja/docs/server-config/graceful-restart-or-stop/)
- [複数サービスの実行](/ja/docs/server-config/run-multiple-service/)
