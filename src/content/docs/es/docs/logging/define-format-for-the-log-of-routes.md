---
title: "Definir formato para el log de rutas"
sidebar:
  order: 6
---

Cuando Gin se inicia, imprime todas las rutas registradas en modo debug. El formato predeterminado se ve así:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Puedes personalizar este formato asignando una función a `gin.DebugPrintRouteFunc`. Esto es útil si quieres registrar las rutas como JSON, pares clave-valor o en cualquier otro formato que tu pipeline de logging espere.

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

Cuando el servidor se inicia, en lugar de las líneas predeterminadas `[GIN-debug]`, verás:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## Ver también

- [Formato de log personalizado](/es/docs/logging/custom-log-format/)
- [Omitir logging](/es/docs/logging/skip-logging/)
