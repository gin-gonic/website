---
title: "데이터베이스 통합"
sidebar:
  order: 10
---

대부분의 실제 Gin 애플리케이션에는 데이터베이스가 필요합니다. 이 가이드에서는 데이터베이스 접근을 깔끔하게 구조화하고, 커넥션 풀링을 설정하고, 핸들러를 테스트 가능하게 유지하며 연결을 건강하게 유지하는 패턴을 다룹니다.

## Gin에서 database/sql 사용하기

Go 표준 라이브러리 `database/sql` 패키지는 Gin과 잘 작동합니다. `main`에서 한 번 연결을 열고 핸들러에 전달합니다.

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

	// 연결이 살아있는지 확인
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

클라이언트가 연결을 끊으면 쿼리가 자동으로 취소되도록 항상 `c.Request.Context()`를 데이터베이스 호출에 전달하세요.

## 커넥션 풀 설정

`database/sql` 패키지는 내부적으로 커넥션 풀을 유지합니다. 프로덕션 워크로드의 경우, 데이터베이스와 트래픽 프로필에 맞게 풀을 설정하세요.

```go
db, err := sql.Open("postgres", dsn)
if err != nil {
	log.Fatal(err)
}

// 데이터베이스에 대한 최대 열린 연결 수.
db.SetMaxOpenConns(25)

// 풀에 유지되는 최대 유휴 연결 수.
db.SetMaxIdleConns(10)

// 연결이 재사용될 수 있는 최대 시간.
db.SetConnMaxLifetime(5 * time.Minute)

// 연결이 닫히기 전에 유휴 상태로 있을 수 있는 최대 시간.
db.SetConnMaxIdleTime(1 * time.Minute)
```

- `SetMaxOpenConns`는 높은 부하에서 애플리케이션이 데이터베이스 서버를 압도하는 것을 방지합니다.
- `SetMaxIdleConns`는 새 요청이 연결 수립 비용을 피하도록 따뜻한 연결을 유지합니다.
- `SetConnMaxLifetime`은 연결을 순환하여 앱이 DNS 변경을 반영하고 오래된 서버 측 세션을 보유하지 않도록 합니다.
- `SetConnMaxIdleTime`은 너무 오래 유휴 상태인 연결을 닫아 양측의 리소스를 해제합니다.

## 의존성 주입 패턴

### 클로저

가장 간단한 접근 방식은 핸들러 함수에서 `*sql.DB`를 클로저로 닫는 것입니다.

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

### 미들웨어

Gin context에 연결을 저장하여 모든 핸들러가 가져올 수 있도록 합니다.

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
		// db 사용...
		_ = db
	})

	r.Run(":8080")
}
```

### 메서드를 가진 구조체

관련 핸들러를 데이터베이스 핸들을 보유하는 구조체로 그룹화합니다. 이 접근 방식은 동일한 의존성을 공유하는 핸들러가 많을 때 잘 확장됩니다.

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

클로저와 구조체 패턴은 컴파일 타임 타입 안전성을 제공하고 런타임 타입 어설션을 피하므로 일반적으로 미들웨어보다 선호됩니다.

## Gin에서 GORM 사용하기

[GORM](https://gorm.io)은 인기 있는 Go ORM입니다. `database/sql`을 래핑하고 마이그레이션, 관계, 쿼리 빌더를 추가합니다.

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

	// 스키마 자동 마이그레이션
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

## 요청 핸들러에서의 트랜잭션 처리

요청이 함께 성공하거나 실패해야 하는 여러 쓰기를 수행해야 할 때 데이터베이스 트랜잭션을 사용합니다.

### database/sql 사용

```go
r.POST("/transfer", func(c *gin.Context) {
	tx, err := db.BeginTx(c.Request.Context(), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not begin transaction"})
		return
	}
	// 오류로 인해 일찍 반환하는 경우 롤백이 실행되도록 보장.
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

### GORM 사용

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

GORM의 `Transaction` 메서드는 반환된 오류에 따라 `Begin`, `Commit`, `Rollback`을 자동으로 처리합니다.

## 모범 사례

- **`main`에서 데이터베이스 연결을 초기화**하고 클로저, 구조체 또는 미들웨어를 통해 공유하세요. 요청당 새 연결을 열지 마세요.
- **항상 매개변수화된 쿼리를 사용하세요.** 문자열을 연결하는 대신 사용자 입력을 인수(`$1`, `?`)로 전달하세요. 이렇게 하면 SQL 인젝션을 방지합니다.
- **프로덕션을 위해 커넥션 풀을 설정하세요.** `MaxOpenConns`, `MaxIdleConns`, `ConnMaxLifetime`을 데이터베이스 서버 제한과 예상 트래픽에 맞는 값으로 설정하세요.
- **연결 오류를 우아하게 처리하세요.** 시작 시 `db.Ping()`을 호출하여 빠르게 실패하세요. 핸들러에서는 의미 있는 HTTP 상태 코드를 반환하고 내부 오류 세부 정보가 클라이언트에 유출되지 않도록 하세요.
- **쿼리에 요청 context를 전달하세요.** `c.Request.Context()`를 사용하여 클라이언트가 연결을 끊거나 타임아웃이 발생하면 장시간 실행 쿼리가 취소되도록 하세요.
- **`defer`로 `*sql.Rows`를 닫으세요.** rows를 닫지 않으면 풀에 연결이 누수됩니다.

## 참고

- [커스텀 HTTP 설정](/ko-kr/docs/server-config/custom-http-config/)
- [커스텀 미들웨어](/ko-kr/docs/middleware/custom-middleware/)
- [미들웨어 사용하기](/ko-kr/docs/middleware/using-middleware/)
