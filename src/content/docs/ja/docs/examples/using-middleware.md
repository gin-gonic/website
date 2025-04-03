---
title: "ミドルウェアを利用する"
---

```go
func main() {
	// デフォルトのミドルウェアが何もない router を作成する
	r := gin.New()

	// グローバルなミドルウェア
	// Logger ミドルウェアは GIN_MODE=release を設定してても、 gin.DefaultWriter にログを出力する
	// gin.DefaultWriter はデフォルトでは os.Stdout。
	router.Use(gin.Logger())

	// Recovery ミドルウェアは panic が発生しても 500 エラーを返してくれる
	router.Use(gin.Recovery())

	// 個別のルーティングに、ミドルウェアを好きに追加することもできる
	router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// 認証が必要なグループ
	// authorized := router.Group("/", AuthRequired())
	// 下記と同一
	authorized := router.Group("/")
	// 個別のグループのミドルウェア。この例では、AuthRequired() ミドルウェアを認証が必要なグループに設定している。
	authorized.Use(AuthRequired())
	{
		authorized.POST("/login", loginEndpoint)
		authorized.POST("/submit", submitEndpoint)
		authorized.POST("/read", readEndpoint)

		// ネストしたグループ
		testing := authorized.Group("testing")
		testing.GET("/analytics", analyticsEndpoint)
	}

	// 0.0.0.0:8080 でサーバーを立てる
	router.Run(":8080")
}
```


