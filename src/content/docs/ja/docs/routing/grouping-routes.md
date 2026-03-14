---
title: "ルートのグルーピング"
sidebar:
  order: 8
---

ルートグループを使用すると、共有URLプレフィックスの下に関連するルートを整理できます。以下の用途に便利です：

- **APIバージョニング** -- すべてのv1エンドポイントを`/v1`の下に、v2エンドポイントを`/v2`の下にグルーピングします。
- **共有ミドルウェア** -- 各ルートに個別にミドルウェアを付与する代わりに、認証、ロギング、レート制限をルートセット全体に一度に適用します。
- **コードの整理** -- ソースコード内で関連するハンドラを視覚的にグルーピングします。

### 基本的なグルーピング

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func loginEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "login"})
}

func submitEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "submit"})
}

func readEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"action": "read"})
}

func main() {
	router := gin.Default()

	// シンプルなグループ: v1
	{
		v1 := router.Group("/v1")
		v1.POST("/login", loginEndpoint)
		v1.POST("/submit", submitEndpoint)
		v1.POST("/read", readEndpoint)
	}

	// シンプルなグループ: v2
	{
		v2 := router.Group("/v2")
		v2.POST("/login", loginEndpoint)
		v2.POST("/submit", submitEndpoint)
		v2.POST("/read", readEndpoint)
	}

	router.Run(":8080")
}
```

### グループへのミドルウェアの適用

`router.Group()`にミドルウェアを渡すか、グループ上で`Use()`を呼び出すことができます。そのグループ内のすべてのルートは、ハンドラの前にミドルウェアを実行します。

```go
// AuthRequiredは認証ミドルウェアのプレースホルダーです。
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ... トークン、セッションなどをチェック
		c.Next()
	}
}

func main() {
	router := gin.Default()

	// 公開ルート -- 認証不要
	public := router.Group("/api")
	{
		public.GET("/health", healthCheck)
	}

	// プライベートルート -- グループ全体に認証ミドルウェアを適用
	private := router.Group("/api")
	private.Use(AuthRequired())
	{
		private.GET("/profile", getProfile)
		private.POST("/settings", updateSettings)
	}

	router.Run(":8080")
}
```

### ネストされたグループ

グループをネストして、ミドルウェアのスコープを適切に保ちながら、より深いURL階層を構築できます。

```go
func main() {
	router := gin.Default()

	// /api
	api := router.Group("/api")
	{
		// /api/v1
		v1 := api.Group("/v1")
		{
			// /api/v1/users
			users := v1.Group("/users")
			users.GET("/", listUsers)
			users.GET("/:id", getUser)

			// /api/v1/posts
			posts := v1.Group("/posts")
			posts.GET("/", listPosts)
			posts.GET("/:id", getPost)
		}
	}

	router.Run(":8080")
}
```

各レベルは親のプレフィックスを継承するため、最終的なルートは`/api/v1/users/`、`/api/v1/users/:id`などになります。
