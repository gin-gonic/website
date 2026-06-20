---
title: "تكامل قاعدة البيانات"
sidebar:
  order: 10
---

تحتاج معظم تطبيقات Gin الحقيقية إلى قاعدة بيانات. يغطي هذا الدليل كيفية تنظيم الوصول إلى قاعدة البيانات بشكل نظيف، وتكوين تجميع الاتصالات، وتطبيق الأنماط التي تبقي معالجاتك قابلة للاختبار واتصالاتك سليمة.

## استخدام database/sql مع Gin

حزمة `database/sql` من المكتبة القياسية في Go تعمل جيداً مع Gin. افتح الاتصال مرة واحدة في `main` ومرره إلى معالجاتك.

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

مرر دائماً `c.Request.Context()` إلى استدعاءات قاعدة البيانات حتى يتم إلغاء الاستعلامات تلقائياً عند قطع العميل للاتصال.

## تكوين تجميع الاتصالات

تحتفظ حزمة `database/sql` بتجمع اتصالات داخلياً. لأحمال العمل الإنتاجية، كوّن التجمع ليتناسب مع خادم قاعدة البيانات وملف حركة المرور.

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

- `SetMaxOpenConns` يمنع تطبيقك من إرهاق خادم قاعدة البيانات تحت الحمل العالي.
- `SetMaxIdleConns` يبقي اتصالات جاهزة حتى تتجنب الطلبات الجديدة تكلفة إنشاء اتصال جديد.
- `SetConnMaxLifetime` يدوّر الاتصالات حتى يلتقط تطبيقك تغييرات DNS ولا يحتفظ بجلسات خادم قديمة.
- `SetConnMaxIdleTime` يغلق الاتصالات الخاملة لفترة طويلة، محرراً الموارد على كلا الجانبين.

## أنماط حقن الاعتماديات

### الإغلاق (Closure)

أبسط نهج هو تضمين `*sql.DB` في دوال المعالجة.

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

### الوسيط

خزّن الاتصال في سياق Gin حتى يتمكن أي معالج من استرداده.

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

### هيكل مع طرق

جمّع المعالجات المرتبطة في هيكل يحمل مقبض قاعدة البيانات. هذا النهج يتوسع جيداً عندما يكون لديك العديد من المعالجات التي تشترك في نفس الاعتماديات.

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

يُفضل نمطا الإغلاق والهيكل عموماً على الوسيط لأنهما يوفران أمان النوع في وقت التجميع ويتجنبان تأكيدات النوع في وقت التشغيل.

## استخدام GORM مع Gin

[GORM](https://gorm.io) هو ORM شائع في Go. يلف `database/sql` ويضيف الترحيلات والعلاقات ومنشئ الاستعلامات.

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

## معالجة المعاملات في معالجات الطلبات

عندما يحتاج طلب لتنفيذ عمليات كتابة متعددة يجب أن تنجح أو تفشل معاً، استخدم معاملة قاعدة بيانات.

### مع database/sql

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

### مع GORM

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

طريقة `Transaction` في GORM تتعامل مع `Begin` و`Commit` و`Rollback` تلقائياً بناءً على الخطأ المُرجع.

## أفضل الممارسات

- **هيّئ اتصال قاعدة البيانات في `main`** وشاركه عبر الإغلاقات أو هيكل أو وسيط. لا تفتح اتصالاً جديداً لكل طلب أبداً.
- **استخدم دائماً استعلامات مُعاملة.** مرر مدخلات المستخدم كوسيطات (`$1`، `?`) بدلاً من ربط السلاسل النصية. هذا يمنع حقن SQL.
- **كوّن تجمع الاتصالات للإنتاج.** عيّن `MaxOpenConns` و`MaxIdleConns` و`ConnMaxLifetime` بقيم تتناسب مع حدود خادم قاعدة البيانات وحركة المرور المتوقعة.
- **تعامل مع أخطاء الاتصال برشاقة.** استدعِ `db.Ping()` عند بدء التشغيل للفشل السريع. في المعالجات، أرجع رموز حالة HTTP ذات معنى وتجنب تسريب تفاصيل الأخطاء الداخلية للعملاء.
- **مرر سياق الطلب إلى الاستعلامات.** استخدم `c.Request.Context()` حتى يتم إلغاء الاستعلامات طويلة التشغيل عند قطع العميل للاتصال أو انتهاء المهلة.
- **أغلق `*sql.Rows` باستخدام `defer`.** عدم إغلاق الصفوف يسرّب الاتصالات إلى التجمع.

## انظر أيضاً

- [تكوين HTTP مخصص](/ar/docs/server-config/custom-http-config/)
- [وسيطات مخصصة](/ar/docs/middleware/custom-middleware/)
- [استخدام الوسيطات](/ar/docs/middleware/using-middleware/)
