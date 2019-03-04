---
title: "ログファイルへ書き込むには"
draft: false
---

```go
func main() {
    // コンソール出力時の色を無効にする。ログファイルに書き込むならば、色は不要なので。
    gin.DisableConsoleColor()

    // ファイルへログを書き込む
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // ログに書き込みつつ、コンソールにも出力する場合、下記のコードを利用する。
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```


