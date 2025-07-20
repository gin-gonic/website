---
title: "控制日誌輸出的著色"
---

預設情況下，主控台上的日誌輸出會根據偵測到的 TTY 進行著色。

永不為日誌著色：

```go
func main() {
  // 停用日誌顏色
  gin.DisableConsoleColor()

  // 建立一個帶有預設中介軟體的 gin 路由器：
  // logger 和 recovery (無崩潰) 中介軟體
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  router.Run(":8080")
}
```

總是為日誌著色：

```go
func main() {
  // 強制日誌顏色
  gin.ForceConsoleColor()

  // 建立一個帶有預設中介軟體的 gin 路由器：
  // logger 和 recovery (無崩潰) 中介軟體
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  router.Run(":8080")
}
```
