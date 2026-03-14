---
title: "よくある質問"
sidebar:
  order: 15
---

## 一般的な質問

### 開発中にライブリロードを有効にするには？

開発中の自動ライブリロードには[Air](https://github.com/air-verse/air)を使用します。Airはファイルを監視し、変更が検出されるとアプリケーションを自動的にリビルド/リスタートします。

**Installation:**

```sh
go install github.com/air-verse/air@latest
```

**Setup:**

Create a `.air.toml` configuration file in your project root:

```sh
air init
```

Then run `air` in your project directory instead of `go run`:

```sh
air
```

Air will watch your `.go` files and automatically rebuild/restart your Gin application on changes. See the [Air documentation](https://github.com/air-verse/air) for configuration options.

### GinでCORSを処理するには？

公式の[gin-contrib/cors](https://github.com/gin-contrib/cors)ミドルウェアを使用します：

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Default CORS configuration
  r.Use(cors.Default())

  // Or customize CORS settings
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

For a complete security overview, see [Security best practices](/en/docs/middleware/security-guide/).

### 静的ファイルを配信するには？

Use `Static()` or `StaticFS()` to serve static files:

```go
func main() {
  r := gin.Default()

  // Serve files from ./assets directory at /assets/*
  r.Static("/assets", "./assets")

  // Serve a single file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Serve from embedded filesystem (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

See [Serving data from file](/en/docs/rendering/serving-data-from-file/) for more details.

### ファイルアップロードを処理するには？

Use `FormFile()` for single files or `MultipartForm()` for multiple files:

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// Multiple files upload
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

See the [Upload file](/en/docs/routing/upload-file/) documentation for more details.

### JWTで認証を実装するには？

Use [gin-contrib/jwt](https://github.com/gin-contrib/jwt) or implement custom middleware. Here's a minimal example:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
      c.Abort()
      return
    }

    // Remove "Bearer " prefix if present
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    }
  }
}
```

For session-based authentication, see [Session management](/en/docs/middleware/session-management/).

### リクエストロギングを設定するには？

Gin includes a default logger middleware via `gin.Default()`. For structured JSON logging in production, see [Structured logging](/en/docs/logging/structured-logging/).

For basic log customization:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

See the [Logging](/en/docs/logging/) section for all options including custom formats, file output, and skipping query strings.

### グレースフルシャットダウンを処理するには？

See [Graceful restart or stop](/en/docs/server-config/graceful-restart-or-stop/) for a complete guide with code examples.

### "405 Method Not Allowed"の代わりに"404 Not Found"が返されるのはなぜ？

By default, Gin returns 404 for routes that don't support the requested HTTP method. Set `HandleMethodNotAllowed = true` to return 405 instead:

```go
r := gin.Default()
r.HandleMethodNotAllowed = true

r.GET("/ping", func(c *gin.Context) {
  c.JSON(200, gin.H{"message": "pong"})
})

r.Run()
```

```sh
$ curl -X POST localhost:8080/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
```

### クエリパラメータとPOSTデータを一緒にバインドするには？

Use `ShouldBind()` which automatically selects the binding based on content type:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

See the [Binding](/en/docs/binding/) section for all binding options.

### リクエストデータをバリデーションするには？

Gin uses [go-playground/validator](https://github.com/go-playground/validator) for validation. Add validation tags to your structs:

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

See [Binding and validation](/en/docs/binding/binding-and-validation/) for custom validators and advanced usage.

### Ginを本番モードで実行するには？

Set the `GIN_MODE` environment variable to `release`:

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

Or set it programmatically:

```go
gin.SetMode(gin.ReleaseMode)
```

Release mode disables debug logging and improves performance.

### Ginでデータベース接続を処理するには？

See [Database integration](/en/docs/server-config/database/) for a complete guide covering `database/sql`, GORM, connection pooling, and dependency injection patterns.

### Ginハンドラをテストするには？

Use `net/http/httptest` to test your routes:

```go
func TestPingRoute(t *testing.T) {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

See the [Testing](/en/docs/testing/) documentation for more examples.

## パフォーマンスに関する質問

### 高トラフィック向けにGinを最適化するには？

1. **Use Release Mode**: Set `GIN_MODE=release`
2. **Disable unnecessary middleware**: Only use what you need
3. **Use `gin.New()` instead of `gin.Default()`** for manual middleware control
4. **Connection pooling**: Configure database connection pools (see [Database integration](/en/docs/server-config/database/))
5. **Caching**: Implement caching for frequently accessed data
6. **Load balancing**: Use reverse proxy (nginx, HAProxy)
7. **Profiling**: Use Go's pprof to identify bottlenecks
8. **Monitoring**: Set up [metrics and monitoring](/en/docs/server-config/metrics/) to track performance

### Ginは本番環境で使えますか？

はい。Ginは多くの企業で本番環境で使用されており、大規模な環境で実戦テスト済みです。本番環境でGinを使用しているプロジェクトの例については[ユーザー](/ja/docs/users/)をご覧ください。

## トラブルシューティング

### ルートパラメータが動作しないのはなぜ？

Ensure route parameters use `:` syntax and are properly extracted:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

See [Parameters in path](/en/docs/routing/param-in-path/) for details.

### ミドルウェアが実行されないのはなぜ？

Middleware must be registered before routes or route groups:

```go
// Correct order
r := gin.New()
r.Use(MyMiddleware()) // Register middleware first
r.GET("/ping", handler) // Then routes

// For route groups
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware for this group
{
  auth.GET("/dashboard", handler)
}
```

See [Using middleware](/en/docs/middleware/using-middleware/) for details.

### リクエストバインディングが失敗するのはなぜ？

Common reasons:

1. **Missing binding tags**: Add `json:"field"` or `form:"field"` tags
2. **Content-Type mismatch**: Ensure client sends correct Content-Type header
3. **Validation errors**: Check validation tags and requirements
4. **Unexported fields**: Only exported (capitalized) struct fields are bound

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

See [Binding and validation](/en/docs/binding/binding-and-validation/) for details.
