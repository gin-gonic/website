---
title: "Контекст и отмена"
sidebar:
  order: 11
---

Каждый обработчик Gin получает `*gin.Context`, который оборачивает стандартный `context.Context` Go вместе с вспомогательными методами запроса и ответа. Понимание правильного использования базового контекста необходимо для создания продакшн-приложений, которые корректно обрабатывают таймауты, отмену и очистку ресурсов.

## Доступ к контексту запроса

Стандартный `context.Context` для текущего запроса доступен через `c.Request.Context()`. Это контекст, который следует передавать любым нижестоящим вызовам — запросам к базе данных, HTTP-запросам или другим операциям ввода-вывода.

```go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/data", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Pass ctx to any downstream function that accepts context.Context.
		log.Println("request context deadline:", ctx.Done())

		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
```

## Таймауты запросов

Вы можете применить таймаут к отдельным запросам с помощью middleware. Когда таймаут истекает, контекст отменяется, и любой нижестоящий вызов, который уважает отмену контекста, немедленно возвращается.

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// TimeoutMiddleware wraps each request with a context deadline.
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		// Replace the request with one that carries the new context.
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/api/slow", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Simulate work that respects the context deadline.
		select {
		case <-time.After(10 * time.Second):
			c.JSON(http.StatusOK, gin.H{"result": "done"})
		case <-ctx.Done():
			c.JSON(http.StatusGatewayTimeout, gin.H{
				"error": "request timed out",
			})
		}
	})

	r.Run(":8080")
}
```

## Передача контекста в запросы к базе данных

Драйверы баз данных в Go принимают `context.Context` в качестве первого аргумента. Всегда передавайте контекст запроса, чтобы запросы автоматически отменялись при отключении клиента или истечении таймаута.

```go
package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://localhost/mydb?sslmode=disable")
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.GET("/api/users/:id", func(c *gin.Context) {
		ctx := c.Request.Context()
		id := c.Param("id")

		var name string
		err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id).Scan(&name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"id": id, "name": name})
	})

	r.Run(":8080")
}
```

## Передача контекста в исходящие HTTP-вызовы

Когда ваш обработчик вызывает внешние сервисы, передавайте контекст запроса, чтобы исходящие вызовы отменялись вместе с входящим запросом.

```go
package main

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/proxy", func(c *gin.Context) {
		ctx := c.Request.Context()

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://httpbin.org/delay/3", nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
	})

	r.Run(":8080")
}
```

## Обработка отключения клиента

Когда клиент закрывает соединение (например, переходит на другую страницу или отменяет запрос), контекст запроса отменяется. Вы можете обнаружить это в долго выполняющихся обработчиках, чтобы прекратить работу заранее и освободить ресурсы.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/stream", func(c *gin.Context) {
		ctx := c.Request.Context()

		for i := 0; ; i++ {
			select {
			case <-ctx.Done():
				log.Println("client disconnected, stopping work")
				return
			case <-time.After(1 * time.Second):
				c.SSEvent("message", gin.H{"count": i})
				c.Writer.Flush()
			}
		}
	})

	r.Run(":8080")
}
```

## Лучшие практики

- **Всегда передавайте контекст запроса.** Передавайте `c.Request.Context()` каждой функции, принимающей `context.Context` — вызовам баз данных, HTTP-клиентам, gRPC-вызовам и любым операциям ввода-вывода. Это гарантирует, что отмена и таймауты распространяются по всей цепочке вызовов.

- **Не храните `*gin.Context` в структурах и не передавайте его через границы горутин.** `gin.Context` привязан к жизненному циклу HTTP-запроса/ответа и не безопасен для конкурентного использования. Вместо этого извлеките нужные значения (контекст запроса, параметры, заголовки) перед запуском горутин.

- **Устанавливайте таймауты на уровне middleware.** Middleware таймаутов даёт вам единое место для установки дедлайнов по всем маршрутам, вместо дублирования логики таймаутов в каждом обработчике.

- **Используйте `context.WithValue` экономно.** Предпочитайте `c.Set()` и `c.Get()` внутри обработчиков Gin. Резервируйте `context.WithValue` для значений, которые должны пересекать границы пакетов через интерфейсы стандартной библиотеки.

## Типичные ошибки

### Использование `gin.Context` в горутинах

`gin.Context` повторно используется между запросами для производительности. Если вам нужен доступ к нему из горутины, вы **должны** вызвать `c.Copy()` для создания копии только для чтения. Использование оригинального `gin.Context` в горутине приводит к гонкам данных и непредсказуемому поведению.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/async", func(c *gin.Context) {
		// WRONG: using c directly in a goroutine.
		// go func() {
		//     log.Println(c.Request.URL.Path) // data race!
		// }()

		// CORRECT: copy the context first.
		cCopy := c.Copy()
		go func() {
			time.Sleep(2 * time.Second)
			log.Printf("async work done for %s\n", cCopy.Request.URL.Path)
		}()

		c.JSON(http.StatusOK, gin.H{"status": "processing"})
	})

	r.Run(":8080")
}
```

### Игнорирование отмены контекста

Если ваш обработчик не проверяет `ctx.Done()`, он продолжит работать даже после отключения клиента, расходуя CPU и память. Всегда используйте API, поддерживающие контекст (`QueryRowContext`, `NewRequestWithContext`, `select` на `ctx.Done()`), чтобы работа останавливалась сразу при отмене контекста.

### Запись ответа после отмены контекста

После отмены контекста избегайте записи в `c.Writer`. Соединение может быть уже закрыто, и записи завершатся тихой ошибкой или паникой. Проверяйте `ctx.Err()` перед записью, если ваш обработчик выполняет долгую работу.

```go
func handler(c *gin.Context) {
	ctx := c.Request.Context()

	result, err := doExpensiveWork(ctx)
	if err != nil {
		if ctx.Err() != nil {
			// Client is gone; do not write a response.
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}
```
