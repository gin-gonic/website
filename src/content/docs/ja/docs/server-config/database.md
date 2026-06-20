---
title: "データベース統合"
sidebar:
  order: 10
---

ほとんどの実用的なGinアプリケーションはデータベースを必要とします。このガイドでは、データベースアクセスをクリーンに構造化する方法、コネクションプーリングの設定、ハンドラのテスタビリティと接続の健全性を維持するパターンの適用方法を説明します。

## GinでのDatabase/sqlの使用

Go標準ライブラリの`database/sql`パッケージはGinとうまく連携します。`main`で接続を一度開き、ハンドラに渡します。

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

クライアントが切断した際にクエリが自動的にキャンセルされるよう、常に`c.Request.Context()`をデータベース呼び出しに渡してください。

## コネクションプーリング設定

`database/sql`パッケージは内部的に接続のプールを管理しています。本番環境のワークロードでは、データベースとトラフィックプロファイルに合わせてプールを設定してください。

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

- `SetMaxOpenConns`は高負荷時にアプリケーションがデータベースサーバーを圧倒するのを防ぎます。
- `SetMaxIdleConns`はウォームな接続を準備し、新しいリクエストがダイヤルのコストを回避できるようにします。
- `SetConnMaxLifetime`は接続をローテーションし、アプリがDNS変更を取得し、古いサーバーサイドセッションを保持しないようにします。
- `SetConnMaxIdleTime`はアイドル時間が長すぎる接続を閉じ、両側のリソースを解放します。

## 依存性注入パターン

### クロージャ

最もシンプルなアプローチは、ハンドラ関数内で`*sql.DB`をクロージャでキャプチャすることです。

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

### ミドルウェア

接続をGinコンテキストに格納して、どのハンドラでも取得できるようにします。

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

### メソッド付き構造体

関連するハンドラをデータベースハンドルを保持する構造体にグループ化します。このアプローチは、同じ依存関係を共有する多くのハンドラがある場合にうまくスケールします。

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

クロージャと構造体パターンは、コンパイル時の型安全性を提供しランタイムの型アサーションを回避するため、一般的にミドルウェアよりも好まれます。

## GinでのGORMの使用

[GORM](https://gorm.io)は人気のあるGo ORMです。`database/sql`をラップし、マイグレーション、アソシエーション、クエリビルダーを追加します。

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

## リクエストハンドラでのトランザクション処理

リクエストが一緒に成功または失敗しなければならない複数の書き込みを実行する必要がある場合、データベーストランザクションを使用します。

### database/sqlの場合

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

### GORMの場合

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

GORMの`Transaction`メソッドは、返されたエラーに基づいて`Begin`、`Commit`、`Rollback`を自動的に処理します。

## ベストプラクティス

- **データベース接続は`main`で初期化**し、クロージャ、構造体、またはミドルウェアを通じて共有します。リクエストごとに新しい接続を開かないでください。
- **常にパラメータ化クエリを使用する。** 文字列連結ではなく、ユーザー入力を引数（`$1`、`?`）として渡します。これによりSQLインジェクションを防止します。
- **本番環境向けにコネクションプールを設定する。** `MaxOpenConns`、`MaxIdleConns`、`ConnMaxLifetime`をデータベースサーバーの制限と予想されるトラフィックに一致する値に設定します。
- **接続エラーをグレースフルに処理する。** 起動時に`db.Ping()`を呼び出して早期に失敗します。ハンドラでは、意味のあるHTTPステータスコードを返し、内部エラーの詳細をクライアントに漏洩しないようにします。
- **クエリにリクエストコンテキストを渡す。** `c.Request.Context()`を使用して、クライアントが切断したりタイムアウトが発火した場合に長時間実行されるクエリがキャンセルされるようにします。
- **`*sql.Rows`は`defer`でクローズする。** 行のクローズを忘れると、プールへの接続がリークします。

## 関連項目

- [カスタムHTTP設定](/ja/docs/server-config/custom-http-config/)
- [カスタムミドルウェア](/ja/docs/middleware/custom-middleware/)
- [ミドルウェアの使用](/ja/docs/middleware/using-middleware/)
