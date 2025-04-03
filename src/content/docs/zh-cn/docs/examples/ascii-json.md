---
title: "AsciiJSON"

---

使用 AsciiJSON 生成具有转义的非 ASCII 字符的 ASCII-only JSON。

```go
func main() {
	router := gin.Default()

	router.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// 输出 : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
		c.AsciiJSON(http.StatusOK, data)
	})

	// 监听并在 0.0.0.0:8080 上启动服务
	router.Run(":8080")
}
```
