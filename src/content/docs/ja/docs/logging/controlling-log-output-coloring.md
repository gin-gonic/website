---
title: "ログ出力の色付け制御"
sidebar:
  order: 4
---

デフォルトでは、コンソール上のログ出力は検出されたTTYに応じて色付けされます。

ログを色付けしない場合：

```go
func main() {
    // ログの色を無効化
    gin.DisableConsoleColor()

    // デフォルトミドルウェアを含むginルーターを作成：
    // loggerとrecovery（クラッシュフリー）ミドルウェア
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

常にログを色付けする場合：

```go
func main() {
    // ログの色を強制
    gin.ForceConsoleColor()

    // デフォルトミドルウェアを含むginルーターを作成：
    // loggerとrecovery（クラッシュフリー）ミドルウェア
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```
