---
title: "Пользовательский middleware"
sidebar:
  order: 3
---

Middleware в Gin — это функция, которая возвращает `gin.HandlerFunc`. Middleware выполняется до и/или после основного обработчика, что делает его полезным для логирования, аутентификации, обработки ошибок и других сквозных задач.

### Поток выполнения middleware

Функция middleware имеет две фазы, разделённые вызовом `c.Next()`:

- **До `c.Next()`** — Код здесь выполняется до того, как запрос достигнет основного обработчика. Используйте эту фазу для подготовительных задач, таких как запись времени начала, проверка токенов или установка значений контекста с помощью `c.Set()`.
- **`c.Next()`** — Вызывает следующий обработчик в цепочке (который может быть другим middleware или финальным обработчиком маршрута). Выполнение приостанавливается здесь до завершения всех нижестоящих обработчиков.
- **После `c.Next()`** — Код здесь выполняется после завершения основного обработчика. Используйте эту фазу для очистки, логирования статуса ответа или измерения задержки.

Если вы хотите полностью остановить цепочку (например, при неудачной аутентификации), вызовите `c.Abort()` вместо `c.Next()`. Это предотвратит выполнение оставшихся обработчиков. Вы можете совместить это с ответом, например `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### Попробуйте

```bash
curl http://localhost:8080/test
```

В логах сервера будут показаны задержка запроса и HTTP-код статуса для каждого запроса, проходящего через middleware `Logger`.

## Смотрите также

- [Middleware обработки ошибок](/ru/docs/middleware/error-handling-middleware/)
- [Использование middleware](/ru/docs/middleware/using-middleware/)
