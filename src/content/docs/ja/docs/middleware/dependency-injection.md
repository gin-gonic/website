---
title: "依存性注入パターン"
sidebar:
  order: 10
---

Ginアプリケーションが成長するにつれて、データベース接続、設定、サービスなどの依存関係をハンドラ間でクリーンに共有する方法が必要になります。Goのシンプルさは、重いDIフレームワークよりも直接的なパターンを推奨します。

## クロージャパターン

最もGoらしいアプローチ：クロージャ経由で依存関係を渡します。

```go
package main

import (
  "database/sql"
  "net/http"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func PingHandler(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    if err := db.Ping(); err != nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{"error": "database unreachable"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "ok"})
  }
}

func GetUserHandler(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    id := c.Param("id")
    var name string
    err := db.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", id).Scan(&name)
    if err != nil {
      c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": name})
  }
}

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()
  r.GET("/ping", PingHandler(db))
  r.GET("/users/:id", GetUserHandler(db))
  r.Run(":8080")
}
```

このパターンは小〜中規模のアプリケーションに適しています。各ハンドラが依存関係を明示的に宣言します。

## 構造体ベースのハンドラ

多くの共有依存関係を持つアプリケーションでは、ハンドラを構造体にグループ化します：

```go
package main

import (
  "database/sql"
  "log/slog"
  "net/http"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

type App struct {
  DB     *sql.DB
  Logger *slog.Logger
}

func (a *App) GetUser(c *gin.Context) {
  id := c.Param("id")
  var name string
  err := a.DB.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", id).Scan(&name)
  if err != nil {
    a.Logger.Error("user not found", slog.String("id", id), slog.String("error", err.Error()))
    c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
    return
  }
  c.JSON(http.StatusOK, gin.H{"id": id, "name": name})
}

func (a *App) CreateUser(c *gin.Context) {
  var input struct {
    Name string `json:"name" binding:"required"`
  }
  if err := c.ShouldBindJSON(&input); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  _, err := a.DB.ExecContext(c.Request.Context(), "INSERT INTO users (name) VALUES ($1)", input.Name)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
    return
  }
  c.JSON(http.StatusCreated, gin.H{"name": input.Name})
}

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  app := &App{
    DB:     db,
    Logger: slog.Default(),
  }

  r := gin.Default()
  r.GET("/users/:id", app.GetUser)
  r.POST("/users", app.CreateUser)
  r.Run(":8080")
}
```

## ミドルウェア注入

ミドルウェアを使用してリクエストコンテキストに依存関係を注入します。多くのハンドラが同じ依存関係を必要とする場合に便利です：

```go
func DatabaseMiddleware(db *sql.DB) gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  }
}

func GetUser(c *gin.Context) {
  db := c.MustGet("db").(*sql.DB)
  // dbを使用...
}

func main() {
  db, _ := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")

  r := gin.Default()
  r.Use(DatabaseMiddleware(db))
  r.GET("/users/:id", GetUser)
  r.Run(":8080")
}
```

:::note
ミドルウェアパターンは`interface{}`と型アサーションを使用するため、コンパイル時の型安全性が失われます。可能な場合はクロージャまたは構造体パターンを優先してください。
:::

## パターンの比較

| パターン | 型安全性 | テスタビリティ | 最適な用途 |
|---------|-------------|-------------|----------|
| クロージャ | コンパイル時 | モック化が容易 | 小規模アプリ、少ない依存関係 |
| 構造体 | コンパイル時 | モック化が容易 | 中〜大規模アプリ |
| ミドルウェア | ランタイム | 中程度 | 横断的関心事、共有状態 |

## 依存性注入によるテスト

すべてのパターンでテストは簡単です -- テストダブルを注入します：

```go
func TestGetUser(t *testing.T) {
  // テストデータベースまたはモックをセットアップ
  db := setupTestDB(t)

  router := gin.New()
  router.GET("/users/:id", GetUserHandler(db)) // クロージャパターン

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/users/1", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
}
```

## 関連項目

- [データベース統合](/ja/docs/server-config/database/)
- [テスト](/ja/docs/testing/)
- [ミドルウェアの使用](/ja/docs/middleware/using-middleware/)
