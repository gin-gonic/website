---
title: "数据库集成"
sidebar:
  order: 10
---

大多数实际的 Gin 应用都需要数据库。本指南介绍了如何整洁地组织数据库访问、配置连接池，以及应用能保持处理函数可测试性和连接健康的模式。

## 在 Gin 中使用 database/sql

Go 标准库的 `database/sql` 包与 Gin 配合良好。在 `main` 中打开一次连接并将其传递给处理函数。

```go
package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "host=localhost port=5432 user=app dbname=mydb sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Verify the connection is alive
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	r.GET("/users/:id", func(c *gin.Context) {
		var name string
		err := db.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", c.Param("id")).Scan(&name)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"name": name})
	})

	r.Run(":8080")
}
```

始终将 `c.Request.Context()` 传递给数据库调用，以便在客户端断开连接时自动取消查询。

## 连接池配置

`database/sql` 包在内部维护一个连接池。对于生产工作负载，请配置连接池以匹配你的数据库和流量配置。

```go
db, err := sql.Open("postgres", dsn)
if err != nil {
	log.Fatal(err)
}

// Maximum number of open connections to the database.
db.SetMaxOpenConns(25)

// Maximum number of idle connections retained in the pool.
db.SetMaxIdleConns(10)

// Maximum amount of time a connection may be reused.
db.SetConnMaxLifetime(5 * time.Minute)

// Maximum amount of time a connection may sit idle before being closed.
db.SetConnMaxIdleTime(1 * time.Minute)
```

- `SetMaxOpenConns` prevents your application from overwhelming the database server under high load.
- `SetMaxIdleConns` keeps warm connections ready so new requests avoid the cost of dialling.
- `SetConnMaxLifetime` rotates connections so your app picks up DNS changes and does not hold stale server-side sessions.
- `SetConnMaxIdleTime` closes connections that have been idle too long, freeing resources on both sides.

## 依赖注入模式

### 闭包

最简单的方式是在处理函数中闭包捕获 `*sql.DB`。

```go
package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func listUsers(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.QueryContext(c.Request.Context(), "SELECT id, name FROM users")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
			return
		}
		defer rows.Close()

		type User struct {
			ID   int    `json:"id"`
			Name string `json:"name"`
		}
		var users []User
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Name); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "scan failed"})
				return
			}
			users = append(users, u)
		}
		c.JSON(http.StatusOK, users)
	}
}

func main() {
	db, _ := sql.Open("postgres", "your-dsn")
	defer db.Close()

	r := gin.Default()
	r.GET("/users", listUsers(db))
	r.Run(":8080")
}
```

### 中间件

将连接存储在 Gin 上下文中，以便任何处理函数都可以获取它。

```go
func DatabaseMiddleware(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func main() {
	db, _ := sql.Open("postgres", "your-dsn")
	defer db.Close()

	r := gin.Default()
	r.Use(DatabaseMiddleware(db))

	r.GET("/users/:id", func(c *gin.Context) {
		db := c.MustGet("db").(*sql.DB)
		// use db...
		_ = db
	})

	r.Run(":8080")
}
```

### 带方法的结构体

将相关的处理函数分组到持有数据库句柄的结构体中。当你有许多共享相同依赖的处理函数时，这种方式扩展性很好。

```go
type UserHandler struct {
	DB *sql.DB
}

func (h *UserHandler) Get(c *gin.Context) {
	var name string
	err := h.DB.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", c.Param("id")).Scan(&name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"name": name})
}

func main() {
	db, _ := sql.Open("postgres", "your-dsn")
	defer db.Close()

	uh := &UserHandler{DB: db}

	r := gin.Default()
	r.GET("/users/:id", uh.Get)
	r.Run(":8080")
}
```

闭包和结构体模式通常优于中间件模式，因为它们提供编译时类型安全性并避免运行时类型断言。

## 在 Gin 中使用 GORM

[GORM](https://gorm.io) 是一个流行的 Go ORM。它封装了 `database/sql` 并添加了迁移、关联和查询构建器。

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

func main() {
	dsn := "host=localhost user=app dbname=mydb port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	// Auto-migrate the schema
	db.AutoMigrate(&Product{})

	r := gin.Default()

	r.POST("/products", func(c *gin.Context) {
		var p Product
		if err := c.ShouldBindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := db.Create(&p).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create product"})
			return
		}
		c.JSON(http.StatusCreated, p)
	})

	r.GET("/products/:id", func(c *gin.Context) {
		var p Product
		if err := db.First(&p, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusOK, p)
	})

	r.Run(":8080")
}
```

## 请求处理函数中的事务处理

当请求需要执行多个必须一起成功或失败的写操作时，使用数据库事务。

### 使用 database/sql

```go
r.POST("/transfer", func(c *gin.Context) {
	tx, err := db.BeginTx(c.Request.Context(), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not begin transaction"})
		return
	}
	// Ensure rollback runs if we return early due to an error.
	defer tx.Rollback()

	_, err = tx.ExecContext(c.Request.Context(),
		"UPDATE accounts SET balance = balance - $1 WHERE id = $2", 100, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "debit failed"})
		return
	}

	_, err = tx.ExecContext(c.Request.Context(),
		"UPDATE accounts SET balance = balance + $1 WHERE id = $2", 100, 2)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "credit failed"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "transfer complete"})
})
```

### 使用 GORM

```go
r.POST("/transfer", func(c *gin.Context) {
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&Account{}).Where("id = ?", 1).
			Update("balance", gorm.Expr("balance - ?", 100)).Error; err != nil {
			return err
		}
		if err := tx.Model(&Account{}).Where("id = ?", 2).
			Update("balance", gorm.Expr("balance + ?", 100)).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "transfer failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "transfer complete"})
})
```

GORM 的 `Transaction` 方法根据返回的错误自动处理 `Begin`、`Commit` 和 `Rollback`。

## 最佳实践

- **在 `main` 中初始化数据库连接**，并通过闭包、结构体或中间件共享。永远不要每个请求打开一个新连接。
- **始终使用参数化查询。** 将用户输入作为参数传递（`$1`、`?`），而不是拼接字符串。这可以防止 SQL 注入。
- **为生产环境配置连接池。** 将 `MaxOpenConns`、`MaxIdleConns` 和 `ConnMaxLifetime` 设置为与数据库服务器限制和预期流量匹配的值。
- **优雅地处理连接错误。** 在启动时调用 `db.Ping()` 以快速失败。在处理函数中，返回有意义的 HTTP 状态码，避免向客户端泄露内部错误详情。
- **将请求上下文传递给查询。** 使用 `c.Request.Context()`，以便在客户端断开连接或超时触发时取消长时间运行的查询。
- **使用 `defer` 关闭 `*sql.Rows`。** 未关闭 rows 会导致连接泄漏回连接池。

## 另请参阅

- [自定义 HTTP 配置](/zh-cn/docs/server-config/custom-http-config/)
- [自定义中间件](/zh-cn/docs/middleware/custom-middleware/)
- [使用中间件](/zh-cn/docs/middleware/using-middleware/)
