---
title: "PureJSON"
draft: false
---

通常、JSON メソッドは `<` のようなHTML 文字を `\u003c` のような Unicode に置き換えます。
もしこのような文字をそのままエンコードしたい場合、PureJSON メソッドを代わりに使用してください。
この機能は、Go 1.6 以下では使えません。

```go
func main() {
	r := gin.Default()
	
	// Unicode を返します
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// そのままの文字を返します
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```


