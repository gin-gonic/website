---
title: "Интеграция с базой данных"
sidebar:
  order: 10
---

Большинство реальных приложений на Gin нуждаются в базе данных. Это руководство описывает, как правильно организовать доступ к базе данных, настроить пул соединений и применять паттерны, которые делают обработчики тестируемыми, а соединения — здоровыми.

## Использование database/sql с Gin

Стандартный пакет Go `database/sql` хорошо работает с Gin. Откройте соединение один раз в `main` и передайте его обработчикам.

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

Всегда передавайте `c.Request.Context()` в вызовы базы данных, чтобы запросы автоматически отменялись при отключении клиента.

## Конфигурация пула соединений

Пакет `database/sql` внутренне поддерживает пул соединений. Для продакшн-нагрузок настройте пул в соответствии с профилем вашей базы данных и трафика.

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

## Паттерны внедрения зависимостей

### Замыкание

Простейший подход — замкнуть `*sql.DB` в ваших функциях-обработчиках.

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

### Middleware

Сохраните соединение в контексте Gin, чтобы любой обработчик мог его получить.

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

### Структура с методами

Сгруппируйте связанные обработчики в структуру, которая содержит дескриптор базы данных. Этот подход хорошо масштабируется при наличии множества обработчиков с одинаковыми зависимостями.

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

Паттерны замыкания и структуры обычно предпочтительнее middleware, поскольку они обеспечивают типобезопасность на этапе компиляции и избегают приведения типов во время выполнения.

## Использование GORM с Gin

[GORM](https://gorm.io) — популярная ORM для Go. Она оборачивает `database/sql` и добавляет миграции, ассоциации и конструктор запросов.

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

## Обработка транзакций в обработчиках запросов

Когда запрос должен выполнить несколько записей, которые должны быть успешны или неуспешны вместе, используйте транзакцию базы данных.

### С database/sql

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

### С GORM

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

Метод `Transaction` в GORM автоматически обрабатывает `Begin`, `Commit` и `Rollback` на основе возвращённой ошибки.

## Лучшие практики

- **Инициализируйте подключение к базе данных в `main`** и делитесь им через замыкания, структуру или middleware. Никогда не открывайте новое подключение для каждого запроса.
- **Всегда используйте параметризованные запросы.** Передавайте пользовательский ввод как аргументы (`$1`, `?`), а не конкатенируйте строки. Это предотвращает SQL-инъекции.
- **Настройте пул соединений для продакшна.** Установите `MaxOpenConns`, `MaxIdleConns` и `ConnMaxLifetime` в значения, соответствующие лимитам вашего сервера баз данных и ожидаемому трафику.
- **Обрабатывайте ошибки подключения корректно.** Вызовите `db.Ping()` при запуске для быстрого обнаружения проблем. В обработчиках возвращайте осмысленные HTTP-коды статуса и избегайте утечки внутренних деталей ошибок клиентам.
- **Передавайте контекст запроса в запросы.** Используйте `c.Request.Context()`, чтобы долгие запросы отменялись при отключении клиента или срабатывании таймаута.
- **Закрывайте `*sql.Rows` с помощью `defer`.** Незакрытые rows приводят к утечке соединений обратно в пул.

## Смотрите также

- [Пользовательская конфигурация HTTP](/ru/docs/server-config/custom-http-config/)
- [Пользовательский middleware](/ru/docs/middleware/custom-middleware/)
- [Использование middleware](/ru/docs/middleware/using-middleware/)
