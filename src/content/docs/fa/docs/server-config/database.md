---
title: "یکپارچه‌سازی پایگاه داده"
sidebar:
  order: 10
---

اکثر برنامه‌های Gin در دنیای واقعی نیاز به پایگاه داده دارند. این راهنما نحوه ساختاردهی تمیز دسترسی به پایگاه داده، پیکربندی connection pooling و اعمال الگوهایی که handlerهای شما را قابل تست و اتصالات شما را سالم نگه می‌دارند پوشش می‌دهد.

## استفاده از database/sql با Gin

پکیج `database/sql` کتابخانه استاندارد Go به خوبی با Gin کار می‌کند. اتصال را یک بار در `main` باز کنید و آن را به handlerها ارسال کنید.

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

همیشه `c.Request.Context()` را به فراخوانی‌های پایگاه داده ارسال کنید تا پرس‌وجوها هنگام قطع اتصال کلاینت به طور خودکار لغو شوند.

## پیکربندی connection pooling

پکیج `database/sql` به صورت داخلی یک pool از اتصالات را نگهداری می‌کند. برای بارهای کاری تولیدی، pool را متناسب با پایگاه داده و پروفایل ترافیک خود پیکربندی کنید.

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

- `SetMaxOpenConns` از overwhelm شدن سرور پایگاه داده تحت بار بالا جلوگیری می‌کند.
- `SetMaxIdleConns` اتصالات آماده نگه می‌دارد تا درخواست‌های جدید هزینه برقراری اتصال را نداشته باشند.
- `SetConnMaxLifetime` اتصالات را چرخش می‌دهد تا برنامه تغییرات DNS را دریافت کند و نشست‌های قدیمی سمت سرور را نگه ندارد.
- `SetConnMaxIdleTime` اتصالاتی که مدت زیادی بیکار بوده‌اند را می‌بندد و منابع را در هر دو طرف آزاد می‌کند.

## الگوهای تزریق وابستگی

### Closure

ساده‌ترین رویکرد، بسته کردن `*sql.DB` در توابع handler است.

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

### میان‌افزار

اتصال را در context Gin ذخیره کنید تا هر handler بتواند آن را بازیابی کند.

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

### Struct با متدها

handlerهای مرتبط را در یک struct که handle پایگاه داده را نگه می‌دارد گروه‌بندی کنید. این رویکرد وقتی handlerهای زیادی با وابستگی‌های مشترک دارید به خوبی مقیاس می‌شود.

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

الگوهای closure و struct معمولاً نسبت به میان‌افزار ترجیح داده می‌شوند زیرا ایمنی نوع زمان کامپایل ارائه می‌دهند و از type assertion در زمان اجرا جلوگیری می‌کنند.

## استفاده از GORM با Gin

[GORM](https://gorm.io) یک ORM محبوب Go است. `database/sql` را پوشش می‌دهد و migration، associations و query builder اضافه می‌کند.

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

## مدیریت تراکنش در handlerهای درخواست

وقتی یک درخواست نیاز به انجام چندین نوشتن دارد که باید همه موفق شوند یا همه شکست بخورند، از تراکنش پایگاه داده استفاده کنید.

### با database/sql

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

### با GORM

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

متد `Transaction` در GORM عملیات `Begin`، `Commit` و `Rollback` را بر اساس خطای برگردانده شده به طور خودکار مدیریت می‌کند.

## بهترین روش‌ها

- **اتصال پایگاه داده را در `main` مقداردهی اولیه کنید** و آن را از طریق closure، struct یا میان‌افزار به اشتراک بگذارید. هرگز یک اتصال جدید برای هر درخواست باز نکنید.
- **همیشه از پرس‌وجوهای پارامتری استفاده کنید.** ورودی کاربر را به عنوان آرگومان (`$1`، `?`) ارسال کنید نه الحاق رشته. این از تزریق SQL جلوگیری می‌کند.
- **connection pool را برای تولید پیکربندی کنید.** `MaxOpenConns`، `MaxIdleConns` و `ConnMaxLifetime` را به مقادیری متناسب با محدودیت‌های سرور پایگاه داده و ترافیک مورد انتظار تنظیم کنید.
- **خطاهای اتصال را با ظرافت مدیریت کنید.** `db.Ping()` را در هنگام راه‌اندازی فراخوانی کنید تا سریع شکست بخورد. در handlerها، کدهای وضعیت HTTP معنادار برگردانید و جزئیات خطای داخلی را به کلاینت‌ها فاش نکنید.
- **context درخواست را به پرس‌وجوها ارسال کنید.** از `c.Request.Context()` استفاده کنید تا پرس‌وجوهای طولانی‌مدت هنگام قطع اتصال کلاینت یا timeout لغو شوند.
- **`*sql.Rows` را با `defer` ببندید.** عدم بسته شدن rows اتصالات را به pool نشت می‌دهد.

## همچنین ببینید

- [پیکربندی HTTP سفارشی](/fa/docs/server-config/custom-http-config/)
- [میان‌افزار سفارشی](/fa/docs/middleware/custom-middleware/)
- [استفاده از میان‌افزار](/fa/docs/middleware/using-middleware/)
