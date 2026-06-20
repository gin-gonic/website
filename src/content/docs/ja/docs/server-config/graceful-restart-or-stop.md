---
title: "グレースフルリスタートまたは停止"
sidebar:
  order: 5
---

サーバープロセスが終了シグナルを受信した場合（例：デプロイやスケーリングイベント中）、即座にシャットダウンすると処理中のすべてのリクエストが破棄され、クライアントには切断された接続と潜在的に破損した操作が残ります。**グレースフルシャットダウン**はこれを以下のように解決します：

- **処理中のリクエストの完了** -- 既に処理されているリクエストに完了する時間を与え、クライアントが接続リセットではなく適切なレスポンスを受け取れるようにします。
- **接続のドレイン** -- サーバーは新しい接続の受け付けを停止し、既存の接続は完了できるようにして、突然の切断を防ぎます。
- **リソースのクリーンアップ** -- 開いているデータベース接続、ファイルハンドル、バックグラウンドワーカーが適切にクローズされ、データの破損やリソースリークを回避します。
- **ゼロダウンタイムデプロイの実現** -- ロードバランサーと組み合わせると、グレースフルシャットダウンにより、ユーザーに見えるエラーなしで新しいバージョンをロールアウトできます。

Goでこれを実現する方法はいくつかあります。

[fvbock/endless](https://github.com/fvbock/endless)を使用してデフォルトの`ListenAndServe`を置き換えることができます。詳細はIssue [#296](https://github.com/gin-gonic/gin/issues/296)を参照してください。

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

endlessの代替：

* [manners](https://github.com/braintree/manners): グレースフルにシャットダウンする礼儀正しいGo HTTPサーバー。
* [graceful](https://github.com/tylerb/graceful): http.Handlerサーバーのグレースフルシャットダウンを実現するGoパッケージ。
* [grace](https://github.com/facebookgo/grace): Goサーバーのグレースフルリスタートとゼロダウンタイムデプロイ。

Go 1.8以降を使用している場合、このライブラリは不要かもしれません！グレースフルシャットダウンには`http.Server`の組み込み[Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown)メソッドの使用を検討してください。ginを使用した完全な[graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown)の例をご覧ください。

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // 接続をサーブ
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // 割り込みシグナルを待ち、5秒のタイムアウトで
  // サーバーをグレースフルにシャットダウン。
  quit := make(chan os.Signal, 1)
  // kill（パラメータなし）はデフォルトでsyscall.SIGTERMを送信
  // kill -2はsyscall.SIGINT
  // kill -9はsyscall.SIGKILLですがキャッチできないため追加不要
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```
