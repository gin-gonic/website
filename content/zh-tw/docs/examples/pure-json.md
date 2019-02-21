---
title: "PureJSON"
draft: false
---

Normally, JSON replaces special HTML characters with their unicode entities, e.g. `<` becomes  `\u003c`. If you want to encode such characters literally, you can use PureJSON instead.
This feature is unavailable in Go 1.6 and lower.

```go
func main() {
	r := gin.Default()
	
	// Serves unicode entities
	r.GET("/json", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// Serves literal characters
	r.GET("/purejson", func(c *gin.Context) {
		c.PureJSON(200, gin.H{
			"html": "<b>Hello, world!</b>",
		})
	})
	
	// listen and serve on 0.0.0.0:8080
	r.Run(":8080")
}
```
