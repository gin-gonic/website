---
title: "AsciiJSON"
draft: false
---

AsciiJSON メソッドを使うことで、ASCII 文字列以外をエスケープした
ASCII 文字列のみの JSON を出力できます。

```go
func main() {
	r := gin.Default()

	r.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"} が出力されます
		c.AsciiJSON(http.StatusOK, data)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```
