---
title: "ミドルウェアを利用する"
draft: false
---

```go
func main() {
	// デフォルトのミドルウェアが何もない router を作成する
	r := gin.New()

	// グローバルなミドルウェア
	// Logger ミドルウェアは GIN_MODE=release を設定してても、 gin.DefaultWriter にログを出力する
	// gin.DefaultWriter はデフォルトでは os.Stdout。
	r.Use(gin.Logger())

	// Recovery ミドルウェアは panic が発生しても 500 エラーを返してくれる
	r.Use(gin.Recovery())

	// 個別のルーティングに、ミドルウェアを好きに追加することもできる
	r.GET("/benchmark", MyBenchLogger(), benchEndpoint)

	// 認証が必要なグループ
	// authorized := r.Group("/", AuthRequired())
	// 下記と同一
	authorized := r.Group("/")
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
	r.Run(":8080")
}
```


