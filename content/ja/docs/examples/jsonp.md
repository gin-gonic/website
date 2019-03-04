---
title: "JSONP をレンダリングする"
draft: false
---

JSONP を使うことで、別のドメインのサーバーからレスポンスを受け取ることができます。callback をクエリ文字列に指定することで、レスポンスに callback を追加します。

```go
func main() {
	r := gin.Default()

	r.GET("/JSONP?callback=x", func(c *gin.Context) {
		data := map[string]interface{}{
			"foo": "bar",
		}
		
		//callback は x です。
		// x({\"foo\":\"bar\"}) が出力されます。
		c.JSONP(http.StatusOK, data)
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```


