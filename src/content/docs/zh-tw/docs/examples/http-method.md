---
title: "使用 HTTP 方法"
---

```go
func main() {
	// 停用主控台顏色
	// gin.DisableConsoleColor()

	// 建立一個帶有預設中介軟體的 gin 路由器：
	// logger 和 recovery (無崩潰) 中介軟體
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// 預設情況下，它會在 :8080 上提供服務，除非定義了
	// PORT 環境變數。
	router.Run()
	// router.Run(":3000") 可用於硬性編碼的連接埠
}
```
