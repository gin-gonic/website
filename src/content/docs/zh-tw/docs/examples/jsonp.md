---
title: "JSONP"
---

使用 JSONP 從不同網域的伺服器請求資料。如果查詢參數回呼存在，則將回呼新增至回應主體。

```go
func main() {
	router := gin.Default()

	router.GET("/JSONP?callback=x", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}
		
		// 回呼為 x
		// 將輸出：   x({\"foo\":\"bar\"})
		c.JSONP(http.StatusOK, data)
	})

	// 在 0.0.0.0:8080 上監聽並提供服務
	router.Run(":8080")
}
```
