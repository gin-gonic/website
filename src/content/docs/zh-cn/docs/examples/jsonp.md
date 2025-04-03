---
title: "JSONP"
---

使用 JSONP 向不同域的服务器请求数据。如果查询参数存在回调，则将回调添加到响应体中。

```go
func main() {
	router := gin.Default()

	router.GET("/JSONP", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}
		
		// /JSONP?callback=x
		// 将输出：x({\"foo\":\"bar\"})
		c.JSONP(http.StatusOK, data)
	})

	// 监听并在 0.0.0.0:8080 上启动服务
	router.Run(":8080")
}
```
