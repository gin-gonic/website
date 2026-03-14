---
title: "資料庫整合"
sidebar:
  order: 10
---

大多數實際的 Gin 應用程式都需要資料庫。本指南介紹如何乾淨地組織資料庫存取、配置連線池，以及應用讓處理函式可測試且連線健康的模式。

## 在 Gin 中使用 database/sql

Go 標準函式庫的 `database/sql` 套件與 Gin 配合良好。在 `main` 中開啟一次連線，並將其傳遞給處理函式。

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

務必將 `c.Request.Context()` 傳遞給資料庫呼叫，這樣當客戶端斷線時查詢會自動取消。

## 連線池配置

`database/sql` 套件在內部維護一個連線池。對於正式環境工作負載，請配置連線池以匹配你的資料庫和流量特性。

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

## 依賴注入模式

### 閉包

最簡單的方式是在處理函式中閉包 `*sql.DB`。

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

### 中介軟體

將連線儲存在 Gin 上下文中，這樣任何處理函式都可以取得它。

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

### 帶方法的結構體

將相關的處理函式分組到一個持有資料庫控制代碼的結構體中。當你有許多共享相同依賴項的處理函式時，此方式擴展良好。

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

閉包和結構體模式通常優於中介軟體，因為它們提供編譯期型別安全性並避免執行期的型別斷言。

## 在 Gin 中使用 GORM

[GORM](https://gorm.io) 是流行的 Go ORM。它包裝了 `database/sql` 並新增了遷移、關聯和查詢建構器。

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

## 在請求處理函式中處理交易

當請求需要執行多個必須一起成功或失敗的寫入操作時，使用資料庫交易。

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

GORM 的 `Transaction` 方法會根據回傳的錯誤自動處理 `Begin`、`Commit` 和 `Rollback`。

## 最佳實務

- **在 `main` 中初始化資料庫連線**，並透過閉包、結構體或中介軟體共享。切勿為每個請求開啟新連線。
- **務必使用參數化查詢。** 將使用者輸入作為參數（`$1`、`?`）傳遞，而非串接字串。這可以防止 SQL 注入。
- **為正式環境配置連線池。** 將 `MaxOpenConns`、`MaxIdleConns` 和 `ConnMaxLifetime` 設為與你的資料庫伺服器限制和預期流量匹配的值。
- **優雅地處理連線錯誤。** 在啟動時呼叫 `db.Ping()` 以快速失敗。在處理函式中，回傳有意義的 HTTP 狀態碼，避免向客戶端洩露內部錯誤細節。
- **將請求上下文傳遞給查詢。** 使用 `c.Request.Context()`，這樣當客戶端斷線或逾時觸發時，長時間執行的查詢會被取消。
- **使用 `defer` 關閉 `*sql.Rows`。** 未關閉 rows 會導致連線洩露回連線池。

## 另請參閱

- [自訂 HTTP 配置](/zh-tw/docs/server-config/custom-http-config/)
- [自訂中介軟體](/zh-tw/docs/middleware/custom-middleware/)
- [使用中介軟體](/zh-tw/docs/middleware/using-middleware/)
