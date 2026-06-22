---
title: "Пользовательское поведение восстановления"
sidebar:
  order: 4
---

Встроенный middleware Gin `gin.Recovery()` перехватывает любую панику, возникающую при обработке запроса, отправляет ответ `500` и поддерживает работу сервера. Когда вам нужно контролировать, что происходит при восстановлении — например, сообщить о панике пользователю, сохранить её в базу данных или отправить в сервис отслеживания ошибок — используйте вместо этого `gin.CustomRecovery()`.

`gin.CustomRecovery()` принимает обработчик с сигнатурой `func(c *gin.Context, recovered any)`. Значение `recovered` — это то, что было передано в `panic()`. Внутри обработчика вы решаете, как ответить, а затем вызываете `c.AbortWithStatus()` (или другой метод прерывания), чтобы пропустить оставшиеся обработчики.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  r := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  r.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  r.Use(gin.CustomRecovery(func(c *gin.Context, recovered any) {
    if err, ok := recovered.(string); ok {
      c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
    }
    c.AbortWithStatus(http.StatusInternalServerError)
  }))

  r.GET("/panic", func(c *gin.Context) {
    // panic with a string -- the custom middleware could save this to a database or report it to the user
    panic("foo")
  })

  r.GET("/", func(c *gin.Context) {
    c.String(http.StatusOK, "ohai")
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

## Попробуйте

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## Смотрите также

- [Пользовательский middleware](/ru/docs/middleware/custom-middleware/)
- [Чистый Gin без middleware по умолчанию](/ru/docs/middleware/without-middleware/)
- [Middleware обработки ошибок](/ru/docs/middleware/error-handling-middleware/)
