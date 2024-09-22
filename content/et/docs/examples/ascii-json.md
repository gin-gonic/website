---
title: "AsciiJSON"
draft: false
---

Kasutades AsciiJSON, et genereerida ASCII-only JSON koos põgenenud non-ASCII märkidega.

```go
func main() {
	r := gin.Default()

	r.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// väljastab : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
		c.AsciiJSON(http.StatusOK, data)
	})

	// Kuulake ja serveerige 0.0.0.0:8080
	r.Run(":8080")
}
```
