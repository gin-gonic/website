---
title: "Usar middleware"
sidebar:
  order: 2
---

El middleware en Gin son funciones que se ejecutan antes (y opcionalmente después) de tu handler de ruta. Se usan para preocupaciones transversales como logging, autenticación, recuperación de errores y modificación de solicitudes.

Gin soporta tres niveles de adjunción de middleware:

- **Middleware global** -- Se aplica a cada ruta del enrutador. Se registra con `router.Use()`. Bueno para preocupaciones como logging y recuperación de panics que se aplican universalmente.
- **Middleware de grupo** -- Se aplica a todas las rutas dentro de un grupo de rutas. Se registra con `group.Use()`. Útil para aplicar autenticación o autorización a un subconjunto de rutas (ej. todas las rutas `/admin/*`).
- **Middleware por ruta** -- Se aplica solo a una ruta individual. Se pasa como argumentos adicionales a `router.GET()`, `router.POST()`, etc. Útil para lógica específica de ruta como limitación de tasa personalizada o validación de entrada.

**Orden de ejecución:** Las funciones middleware se ejecutan en el orden en que se registran. Cuando un middleware llama a `c.Next()`, pasa el control al siguiente middleware (o al handler final), y luego reanuda la ejecución después de que `c.Next()` retorna. Esto crea un patrón tipo pila (LIFO) -- el primer middleware registrado es el primero en comenzar pero el último en terminar. Si un middleware no llama a `c.Next()`, los middleware subsiguientes y el handler se omiten (útil para cortocircuitar con `c.Abort()`).

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` es una función de conveniencia que crea un enrutador con los middleware `Logger` y `Recovery` ya adjuntos. Si quieres un enrutador vacío sin middleware, usa `gin.New()` como se muestra arriba y agrega solo el middleware que necesites.
:::
