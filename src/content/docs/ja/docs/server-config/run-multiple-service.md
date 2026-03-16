---
title: "複数サービスの実行"
sidebar:
  order: 4
---

`golang.org/x/sync/errgroup` パッケージの `errgroup.Group` を使用して、同じプロセス内で複数のGinサーバーを異なるポートで実行できます。これは、パブリックAPI（ポート8080）と管理API（ポート8081）など、別々のバイナリをデプロイせずに異なるAPIを公開する必要がある場合に便利です。

各サーバーは独自のルーター、ミドルウェアスタック、`http.Server` 設定を持ちます。

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## テスト

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
いずれかのサーバーが起動に失敗した場合（例えば、ポートが既に使用中の場合）、`g.Wait()` は最初のエラーを返します。プロセスが実行し続けるには、両方のサーバーが正常に起動する必要があります。
:::

## 関連項目

- [カスタムHTTP設定](/ja/docs/server-config/custom-http-config/)
- [グレースフルリスタートまたは停止](/ja/docs/server-config/graceful-restart-or-stop/)
