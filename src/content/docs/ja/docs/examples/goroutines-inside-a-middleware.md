---
title: "ミドルウェア内の Goroutine"
---

新しい goroutine をミドルウェアやハンドラー内で生成する場合、goroutine の内部でオリジナルの context を **使用しないでください**。読み込み用のコピーを使ってください。

```go
func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // goroutine 内で使用するコピーを生成します
    cCp := c.Copy()
    go func() {
      // time.Sleep() を使って、長時間かかる処理をシミュレートします。5秒です。
      time.Sleep(5 * time.Second)

      // コピーされた context である "cCp" を使ってください。重要！
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // time.Sleep() を使って、長時間かかる処理をシミュレートします。5秒です。
    time.Sleep(5 * time.Second)

    // goroutine を使ってなければ、context をコピーする必要はありません。
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // 0.0.0.0:8080 でサーバーを立てます。
  router.Run(":8080")
}
```


