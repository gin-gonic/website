---
title: "使用中介軟體"
---

```go
func main() {
	// 預設建立一個不含任何中介軟體的路由器
	r := gin.New()

	// 全域中介軟體
	// 即使您設定 GIN_MODE=release，Logger 中介軟體也會將日誌寫入 gin.DefaultWriter。
	// 預設情況下，gin.DefaultWriter = os.Stdout
	r.Use(gin.Logger())

	// Recovery 中介軟體可從任何 panic 中恢復，並在發生 panic 時寫入 500。
	r.Use(gin.Recovery())

	// 每個路由的中介軟體，您可以隨意新增多個。
	r.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// 授權群組
	// authorized := router.Group("/", AuthRequired())
	// 與以下完全相同：
	authorized := r.Group("/")
	// 每個群組的中介軟體！在此範例中，我們僅在 "authorized" 群組中使用自訂建立的
	// AuthRequired() 中介軟體。
	authorized.Use(AuthRequired())
	{
		authorized.POST("/login", loginEndpoint)
		authorized.POST("/submit", submitEndpoint)
		authorized.POST("/read", readEndpoint)

		// 巢狀群組
		testing := authorized.Group("testing")
		testing.GET("/analytics", analyticsEndpoint)
	}

	// 在 0.0.0.0:8080 上監聽並提供服務
	r.Run(":8080")
}
```

