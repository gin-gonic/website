---
title: "AsciiJSON"
draft: false
---

Using AsciiJSON to Generates ASCII-only JSON with escaped non-ASCII characters.

```go
func main() {
	router := gin.Default()

	router.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
		c.AsciiJSON(http.StatusOK, data)
	})

	// Listen and serve on 0.0.0.0:8080
	router.Run(":8080")
}
```
