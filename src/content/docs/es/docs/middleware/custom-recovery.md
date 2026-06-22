---
title: "Comportamiento de recuperación personalizado"
sidebar:
  order: 4
---

El middleware integrado `gin.Recovery()` de Gin captura cualquier panic que ocurra mientras se maneja una solicitud, escribe una respuesta `500` y mantiene el servidor en funcionamiento. Cuando necesitas controlar lo que sucede durante la recuperación -- por ejemplo, para informar el panic al usuario, guardarlo en una base de datos o enviarlo a un servicio de seguimiento de errores -- usa `gin.CustomRecovery()` en su lugar.

`gin.CustomRecovery()` recibe un handler con la firma `func(c *gin.Context, recovered any)`. El valor `recovered` es lo que se haya pasado a `panic()`. Dentro del handler decides cómo responder y luego llamas a `c.AbortWithStatus()` (u otro método de aborto) para que los handlers restantes se omitan.

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

## Pruébalo

```bash
# Triggers the panic; the custom recovery handler returns the message
curl http://localhost:8080/panic
# => error: foo

# A normal request still works
curl http://localhost:8080/
# => ohai
```

## Ver también

- [Middleware personalizado](/es/docs/middleware/custom-middleware/)
- [Gin en blanco sin middleware por defecto](/es/docs/middleware/without-middleware/)
- [Middleware de manejo de errores](/es/docs/middleware/error-handling-middleware/)
