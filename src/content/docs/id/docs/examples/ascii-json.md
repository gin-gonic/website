---
title: "AsciiJSON"
---

AsciiJSON digunakan untuk menghasilkan JSON yang hanya mengandung karakter ASCII, karakter non-ASCII akan dikonversi ke bentuk escape.

```go
func main() {
	router := gin.Default()

	router.GET("/someJSON", func(c *gin.Context) {
		data := map[string]interface{}{
			"lang": "GO语言",
			"tag":  "<br>",
		}

		// akan menghasilkan : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
		c.AsciiJSON(http.StatusOK, data)
	})

	// jalankan server pada 0.0.0.0:8080
	router.Run(":8080")
}
```
