---
title: "PureJSON"
---

通常、JSON メソッドは `<` のようなHTML 文字を `\u003c` のような Unicode に置き換えます。
もしこのような文字をそのままエンコードしたい場合、PureJSON メソッドを代わりに使用してください。
この機能は、Go 1.6 以下では使えません。

```go
func main() {
  router := gin.Default()
  
  // Unicode を返します
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })
  
  // そのままの文字を返します
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON レスポンスとステータスコードで早期に中断 (v1.11+)
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // 0.0.0.0:8080 でサーバーを立てます。
  router.Run(":8080")
}
```


