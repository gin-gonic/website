---
title: "ミドルウェア内のゴルーチン"
sidebar:
  order: 6
---

ミドルウェアやハンドラ内で新しいゴルーチンを起動する場合、その中でオリジナルのコンテキストを使用**すべきではありません**。読み取り専用のコピーを使用する必要があります。

### `c.Copy()`が不可欠な理由

Ginはパフォーマンスのために**sync.Pool**を使用してリクエスト間で`gin.Context`オブジェクトを再利用します。ハンドラが戻ると、`gin.Context`はプールに返され、まったく別のリクエストに割り当てられる可能性があります。その時点でゴルーチンがまだ元のコンテキストへの参照を保持していると、別のリクエストに属するフィールドを読み書きすることになります。これにより**競合状態**、**データの破損**、または**panic**が発生します。

`c.Copy()`を呼び出すと、ハンドラが戻った後も安全に使用できるコンテキストのスナップショットが作成されます。コピーにはリクエスト、URL、キー、その他の読み取り専用データが含まれますが、プールのライフサイクルからは切り離されています。

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // ゴルーチン内で使用するコピーを作成
    cCp := c.Copy()
    go func() {
      // time.Sleep()で長いタスクをシミュレート。5秒
      time.Sleep(5 * time.Second)

      // コピーされたコンテキスト"cCp"を使用していることに注意、重要
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // time.Sleep()で長いタスクをシミュレート。5秒
    time.Sleep(5 * time.Second)

    // ゴルーチンを使用していないので、コンテキストをコピーする必要はありません
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```
