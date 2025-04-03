---
title: "GET,POST,PUT,PATCH,DELETE,OPTIONS メソッドを使う"
draft: false
---

```go
func main() {
	// デフォルトのミドルウェアで新しい gin ルーターを作成する
	// logger とアプリケーションクラッシュをキャッチする recovery ミドルウェア
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// デフォルトではポート 8080 が利用されるが、
	// 環境変数 PORT を指定していればそちらが優先される。
	router.Run()
	// router.Run(":3000") と書くことでポートをハードコーディングできる
}
```


