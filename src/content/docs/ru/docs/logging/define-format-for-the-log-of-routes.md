---
title: "Формат лога маршрутов"
sidebar:
  order: 6
---

При запуске Gin в режиме отладки выводит все зарегистрированные маршруты. Формат по умолчанию выглядит так:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Вы можете настроить этот формат, назначив функцию переменной `gin.DebugPrintRouteFunc`. Это полезно, если вы хотите логировать маршруты в формате JSON, пар ключ-значение или в любом другом формате, ожидаемом вашей системой логирования.

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
    log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
  }

  router.POST("/foo", func(c *gin.Context) {
    c.JSON(http.StatusOK, "foo")
  })

  router.GET("/bar", func(c *gin.Context) {
    c.JSON(http.StatusOK, "bar")
  })

  router.GET("/status", func(c *gin.Context) {
    c.JSON(http.StatusOK, "ok")
  })

  router.Run(":8080")
}
```

При запуске сервера вместо стандартных строк `[GIN-debug]` вы увидите:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## Смотрите также

- [Пользовательский формат логов](/ru/docs/logging/custom-log-format/)
- [Пропуск логирования](/ru/docs/logging/skip-logging/)
