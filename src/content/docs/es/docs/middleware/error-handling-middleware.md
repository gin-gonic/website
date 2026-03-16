---
title: "Middleware de manejo de errores"
sidebar:
  order: 4
---

En una aplicación RESTful típica, podrías encontrar errores en cualquier ruta — entrada inválida, fallos de base de datos, acceso no autorizado o errores internos. Manejar errores individualmente en cada handler lleva a código repetitivo y respuestas inconsistentes.

Un middleware centralizado de manejo de errores resuelve esto ejecutándose después de cada solicitud y verificando si hay errores añadidos al contexto de Gin mediante `c.Error(err)`. Si se encuentran errores, envía una respuesta JSON estructurada con un código de estado apropiado.

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

## Pruébalo

```sh
# Successful request
curl http://localhost:8080/ok
# Output: {"message":"Everything is fine!","success":true}

# Error request -- middleware catches the error
curl http://localhost:8080/error
# Output: {"message":"something went wrong","success":false}
```

:::tip
Puedes extender este patrón para mapear tipos de error específicos a diferentes códigos de estado HTTP, o para registrar errores en un servicio externo antes de responder.
:::

## Ver también

- [Middleware personalizado](/es/docs/middleware/custom-middleware/)
- [Usar middleware](/es/docs/middleware/using-middleware/)
