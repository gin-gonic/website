---
title: "Veritabanı Entegrasyonu"
sidebar:
  order: 10
---

Gerçek dünya Gin uygulamalarının çoğu bir veritabanına ihtiyaç duyar. Bu kılavuz, veritabanı erişimini temiz bir şekilde yapılandırmayı, bağlantı havuzunu ayarlamayı ve işleyicilerinizi test edilebilir ve bağlantılarınızı sağlıklı tutan kalıpları uygulamayı kapsar.

## Gin ile database/sql kullanımı

Go standart kütüphanesi `database/sql` paketi Gin ile iyi çalışır. Bağlantıyı `main`'de bir kez açın ve işleyicilerinize geçirin.

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

İstemci bağlantısını kestiğinde sorguların otomatik olarak iptal edilmesi için veritabanı çağrılarına her zaman `c.Request.Context()` geçirin.

## Bağlantı havuzu yapılandırması

`database/sql` paketi dahili olarak bir bağlantı havuzu tutar. Üretim iş yükleri için havuzu veritabanınıza ve trafik profilinize uyacak şekilde yapılandırın.

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

- `SetMaxOpenConns` yüksek yük altında uygulamanızın veritabanı sunucusunu aşırı yüklemesini önler.
- `SetMaxIdleConns` sıcak bağlantıları hazır tutar böylece yeni istekler arama maliyetinden kaçınır.
- `SetConnMaxLifetime` bağlantıları döndürür böylece uygulamanız DNS değişikliklerini algılar ve eski sunucu tarafı oturumlarını tutmaz.
- `SetConnMaxIdleTime` çok uzun süre boşta kalan bağlantıları kapatır ve her iki tarafta kaynakları serbest bırakır.

## Bağımlılık enjeksiyonu kalıpları

### Closure

En basit yaklaşım, işleyici fonksiyonlarınızda `*sql.DB`'yi closure ile kapsamaktır.

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

### Ara katman

Bağlantıyı Gin context'ine saklayarak herhangi bir işleyicinin alabilmesini sağlayın.

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

### Metodlarla struct

İlgili işleyicileri veritabanı tanıtıcısını tutan bir struct'ta gruplayın. Bu yaklaşım, aynı bağımlılıkları paylaşan çok sayıda işleyiciniz olduğunda iyi ölçeklenir.

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

Closure ve struct kalıpları, derleme zamanı tür güvenliği sağladıkları ve çalışma zamanında tür dönüşümlerinden kaçındıkları için genellikle ara katmana tercih edilir.

## Gin ile GORM kullanımı

[GORM](https://gorm.io), popüler bir Go ORM'sidir. `database/sql`'i sarar ve göçler, ilişkiler ve sorgu oluşturucu ekler.

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

## İstek işleyicilerinde transaction yönetimi

Bir istek, birlikte başarılı veya başarısız olması gereken birden fazla yazma işlemi gerektirdiğinde, bir veritabanı transaction'ı kullanın.

### database/sql ile

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

### GORM ile

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

GORM'un `Transaction` metodu, döndürülen hataya göre `Begin`, `Commit` ve `Rollback` işlemlerini otomatik olarak yönetir.

## En iyi uygulamalar

- **Veritabanı bağlantısını `main`'de başlatın** ve closure'lar, struct veya ara katman aracılığıyla paylaşın. İstek başına asla yeni bağlantı açmayın.
- **Her zaman parametreli sorgular kullanın.** Kullanıcı girdisini dize birleştirmek yerine argümanlar (`$1`, `?`) olarak geçirin. Bu, SQL enjeksiyonunu önler.
- **Bağlantı havuzunu üretim için yapılandırın.** `MaxOpenConns`, `MaxIdleConns` ve `ConnMaxLifetime` değerlerini veritabanı sunucu limitlerinize ve beklenen trafiğinize uygun değerlere ayarlayın.
- **Bağlantı hatalarını zarif şekilde işleyin.** Hızlı başarısız olmak için başlangıçta `db.Ping()` çağırın. İşleyicilerde anlamlı HTTP durum kodları döndürün ve dahili hata ayrıntılarını istemcilere sızdırmaktan kaçının.
- **Sorulara istek context'ini geçirin.** İstemci bağlantısını kestiğinde veya zaman aşımı tetiklendiğinde uzun süren sorguların iptal edilmesi için `c.Request.Context()` kullanın.
- **`*sql.Rows`'u `defer` ile kapatın.** Satırları kapatmamak havuza bağlantı sızdırır.

## Ayrıca bakınız

- [Özel HTTP yapılandırması](/tr/docs/server-config/custom-http-config/)
- [Özel Ara Katman](/tr/docs/middleware/custom-middleware/)
- [Ara katman kullanımı](/tr/docs/middleware/using-middleware/)
