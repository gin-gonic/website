---
title: "クエリ文字列のパラメータ"
draft: false
---

```go
func main() {
	router := gin.Default()

	// クエリ文字列のパラメータは、既存の Request オブジェクトによって解析される。
	// このルーターは、/welcome?firstname=Jane&lastname=Doe にマッチしたURLにアクセスすると、レスポンスを返す
	router.GET("/welcome", func(c *gin.Context) {
		firstname := c.DefaultQuery("firstname", "Guest")
		lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname") へのショートカット

		c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
	})
	router.Run(":8080")
}
```


