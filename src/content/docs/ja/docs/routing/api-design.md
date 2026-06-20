---
title: "API設計パターン"
sidebar:
  order: 10
---

GinでRESTful APIを構築するには、ルートを定義するだけでは不十分です。適切に設計されたAPIは、一貫したレスポンス形式、予測可能なページネーション、明確なバージョニング、構造化されたエラーハンドリングを使用します。このガイドでは、本番環境のGinアプリケーションに適用できる実践的なパターンを紹介します。

## 一貫したレスポンス形式

すべてのレスポンスを標準的なエンベロープでラップすると、APIの利用者にとって便利になります。データ、エラー、メタデータがどこにあるかを常に把握できます。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Responseは標準的なAPIエンベロープです。
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type Meta struct {
	Page       int `json:"page,omitempty"`
	PerPage    int `json:"per_page,omitempty"`
	Total      int `json:"total,omitempty"`
	TotalPages int `json:"total_pages,omitempty"`
}

// OKは成功レスポンスを送信します。
func OK(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
	})
}

// Failはエラーレスポンスを送信します。
func Fail(c *gin.Context, status int, code, message string) {
	c.JSON(status, Response{
		Success: false,
		Error:   &ErrorInfo{Code: code, Message: message},
	})
}

func main() {
	r := gin.Default()

	r.GET("/api/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		// 検索のシミュレーション
		if id == "0" {
			Fail(c, http.StatusNotFound, "USER_NOT_FOUND", "no user with that ID")
			return
		}
		OK(c, gin.H{"id": id, "name": "Alice"})
	})

	r.Run(":8080")
}
```

## ページネーション

### リミット/オフセットページネーション

リミット/オフセットは最もシンプルなアプローチです。総行数の計算が許容範囲である小〜中規模のデータセットに適しています。

```go
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/articles", func(c *gin.Context) {
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

		if limit > 100 {
			limit = 100 // ページサイズの上限
		}

		// articles, total := db.ListArticles(limit, offset)

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []gin.H{}, // articles
			"meta": gin.H{
				"limit":  limit,
				"offset": offset,
				"total":  0, // total
			},
		})
	})

	r.Run(":8080")
}
```

### カーソルベースページネーション

カーソルベースページネーションは、大きなオフセットによるパフォーマンスの問題を回避します。最後のアイテムのID（または別の一意でソート可能なフィールド）をカーソルとして渡します。

```go
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/events", func(c *gin.Context) {
		cursor := c.Query("cursor") // 例：最後のイベントID
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

		if limit > 100 {
			limit = 100
		}

		// events, nextCursor := db.ListEvents(cursor, limit)
		_ = cursor

		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"data":        []gin.H{}, // events
			"next_cursor": "",        // nextCursor（空文字列はこれ以上ページがないことを意味する）
		})
	})

	r.Run(":8080")
}
```

## フィルタリングとソート

クエリパラメータを通じてフィルタリングとソートを受け付けます。一貫したパラメータ名を使用して予測可能なインターフェースを維持します。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// GET /api/products?category=electronics&min_price=10&sort=price&order=asc
	r.GET("/api/products", func(c *gin.Context) {
		category := c.Query("category")
		minPrice := c.Query("min_price")
		maxPrice := c.Query("max_price")
		sortBy := c.DefaultQuery("sort", "created_at")
		order := c.DefaultQuery("order", "desc")

		// インジェクションを防ぐため、ソートフィールドを許可リストに対して検証
		allowed := map[string]bool{"created_at": true, "price": true, "name": true}
		if !allowed[sortBy] {
			sortBy = "created_at"
		}
		if order != "asc" && order != "desc" {
			order = "desc"
		}

		// これらのフィルターを使用してクエリを構築して実行...
		_ = category
		_ = minPrice
		_ = maxPrice

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []gin.H{},
			"filters": gin.H{
				"category":  category,
				"min_price": minPrice,
				"max_price": maxPrice,
				"sort":      sortBy,
				"order":     order,
			},
		})
	})

	r.Run(":8080")
}
```

## APIバージョニング

### URLパスバージョニング

URLパスバージョニングは最も一般的な戦略です。明示的で、ルーティングが簡単で、`curl`でテストしやすいです。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
		v1.GET("/users", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"version": "v1", "users": []string{}})
		})
	}

	v2 := r.Group("/api/v2")
	{
		v2.GET("/users", func(c *gin.Context) {
			// v2は異なる形式を返す
			c.JSON(http.StatusOK, gin.H{
				"version": "v2",
				"data":    []gin.H{},
				"meta":    gin.H{"total": 0},
			})
		})
	}

	r.Run(":8080")
}
```

### ヘッダーベースバージョニング

ヘッダーバージョニングはURLをクリーンに保ちますが、クライアントがカスタムヘッダーを設定する必要があります。ミドルウェアでヘッダーを読み取り、バージョンをコンテキストに格納できます。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// VersionMiddlewareはAccept-VersionヘッダーからAPIバージョンを読み取ります。
func VersionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		version := c.GetHeader("Accept-Version")
		if version == "" {
			version = "v1" // デフォルト
		}
		c.Set("api_version", version)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(VersionMiddleware())

	r.GET("/api/users", func(c *gin.Context) {
		version := c.GetString("api_version")

		switch version {
		case "v2":
			c.JSON(http.StatusOK, gin.H{"version": "v2", "data": []gin.H{}})
		default:
			c.JSON(http.StatusOK, gin.H{"version": "v1", "users": []string{}})
		}
	})

	r.Run(":8080")
}
```

## エラーハンドリングパターン

### カスタムエラー型

アプリケーションレベルのエラー型を定義して、ハンドラが意味のある構造化されたエラーを返せるようにします。

```go
package main

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AppErrorは構造化されたAPIエラーを表します。
type AppError struct {
	Status  int    `json:"-"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e *AppError) Error() string {
	return e.Message
}

var (
	ErrNotFound     = &AppError{Status: 404, Code: "NOT_FOUND", Message: "resource not found"}
	ErrUnauthorized = &AppError{Status: 401, Code: "UNAUTHORIZED", Message: "authentication required"}
	ErrBadRequest   = &AppError{Status: 400, Code: "BAD_REQUEST", Message: "invalid request"}
)

// ErrorHandlerはc.Error()で設定されたエラーをキャッチするミドルウェアです。
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) == 0 {
			return
		}

		err := c.Errors.Last().Err
		var appErr *AppError
		if errors.As(err, &appErr) {
			c.JSON(appErr.Status, gin.H{
				"success": false,
				"error":   gin.H{"code": appErr.Code, "message": appErr.Message},
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   gin.H{"code": "INTERNAL", "message": "an unexpected error occurred"},
			})
		}
	}
}

func main() {
	r := gin.Default()
	r.Use(ErrorHandler())

	r.GET("/api/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		if id == "0" {
			_ = c.Error(ErrNotFound)
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"id": id}})
	})

	r.Run(":8080")
}
```

## リソースベースのルート整理

APIが成長するにつれて、リソースごとにルートを整理しましょう。各リソースは`gin.RouterGroup`にルートを登録する関数を持つ独自のファイルを持ちます。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterUserRoutesはすべての/usersエンドポイントをセットアップします。
func RegisterUserRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/users")
	{
		users.GET("/", listUsers)
		users.POST("/", createUser)
		users.GET("/:id", getUser)
		users.PUT("/:id", updateUser)
		users.DELETE("/:id", deleteUser)
	}
}

// RegisterOrderRoutesはすべての/ordersエンドポイントをセットアップします。
func RegisterOrderRoutes(rg *gin.RouterGroup) {
	orders := rg.Group("/orders")
	{
		orders.GET("/", listOrders)
		orders.POST("/", createOrder)
		orders.GET("/:id", getOrder)
	}
}

func listUsers(c *gin.Context)  { c.JSON(http.StatusOK, gin.H{"action": "list_users"}) }
func createUser(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"action": "create_user"}) }
func getUser(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"action": "get_user"}) }
func updateUser(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"action": "update_user"}) }
func deleteUser(c *gin.Context) { c.Status(http.StatusNoContent) }

func listOrders(c *gin.Context)  { c.JSON(http.StatusOK, gin.H{"action": "list_orders"}) }
func createOrder(c *gin.Context) { c.JSON(http.StatusCreated, gin.H{"action": "create_order"}) }
func getOrder(c *gin.Context)    { c.JSON(http.StatusOK, gin.H{"action": "get_order"}) }

func main() {
	r := gin.Default()

	api := r.Group("/api/v1")
	RegisterUserRoutes(api)
	RegisterOrderRoutes(api)

	r.Run(":8080")
}
```

実際のプロジェクトでは、`RegisterUserRoutes`を`routes/users.go`ファイルに、`RegisterOrderRoutes`を`routes/orders.go`に配置し、`main.go`から両方を呼び出します。これにより各リソースが独立し、無関係なコードに触れることなくリソースの追加や削除が容易になります。
