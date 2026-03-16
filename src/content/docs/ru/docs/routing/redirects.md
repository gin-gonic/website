---
title: "Перенаправления"
sidebar:
  order: 9
---

Gin поддерживает как HTTP-перенаправления (отправка клиента на другой URL), так и перенаправления на уровне маршрутизатора (внутренняя переадресация запроса на другой обработчик без обращения клиента к серверу).

## HTTP-перенаправления

Используйте `c.Redirect` с соответствующим кодом статуса HTTP для перенаправления клиента:

- **301 (`http.StatusMovedPermanently`)** — ресурс перемещён навсегда. Браузеры и поисковые системы обновляют свои кэши.
- **302 (`http.StatusFound`)** — временное перенаправление. Браузер следует по ссылке, но не кэширует новый URL.
- **307 (`http.StatusTemporaryRedirect`)** — как 302, но браузер должен сохранить исходный HTTP-метод (полезно для POST-перенаправлений).
- **308 (`http.StatusPermanentRedirect`)** — как 301, но браузер должен сохранить исходный HTTP-метод.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## Тестирование

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
При перенаправлении из POST-обработчика используйте `302` или `307` вместо `301`. Перенаправление `301` может заставить некоторые браузеры изменить метод с POST на GET, что может привести к неожиданному поведению.
:::

:::tip
Внутренние перенаправления через `router.HandleContext(c)` не отправляют ответ перенаправления клиенту. Запрос перенаправляется внутри сервера, что быстрее и невидимо для клиента.
:::

## Смотрите также

- [Группировка маршрутов](/ru/docs/routing/grouping-routes/)
