---
title: "Middleware обработки ошибок"
sidebar:
  order: 4
---

В типичном RESTful-приложении вы можете столкнуться с ошибками в любом маршруте — некорректный ввод, сбои базы данных, несанкционированный доступ или внутренние ошибки. Обработка ошибок по отдельности в каждом обработчике приводит к повторяющемуся коду и непоследовательным ответам.

Централизованный middleware обработки ошибок решает эту проблему, выполняясь после каждого запроса и проверяя наличие ошибок, добавленных в контекст Gin через `c.Error(err)`. Если ошибки найдены, он отправляет структурированный JSON-ответ с соответствующим кодом статуса.

```go
package main

import (
  "errors"
  "net/http"

  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Next() // Process the request first

    // Check if any errors were added to the context
    if len(c.Errors) > 0 {
      err := c.Errors.Last().Err

      c.JSON(http.StatusInternalServerError, gin.H{
        "success": false,
        "message": err.Error(),
      })
    }
  }
}

func main() {
  r := gin.Default()

  // Attach the error-handling middleware
  r.Use(ErrorHandler())

  r.GET("/ok", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "success": true,
      "message": "Everything is fine!",
    })
  })

  r.GET("/error", func(c *gin.Context) {
    c.Error(errors.New("something went wrong"))
  })

  r.Run(":8080")
}
```

## Тестирование

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
Вы можете расширить этот паттерн для сопоставления определённых типов ошибок с различными HTTP-кодами статуса или для логирования ошибок во внешний сервис перед отправкой ответа.
:::

## Смотрите также

- [Пользовательский middleware](/ru/docs/middleware/custom-middleware/)
- [Использование middleware](/ru/docs/middleware/using-middleware/)
