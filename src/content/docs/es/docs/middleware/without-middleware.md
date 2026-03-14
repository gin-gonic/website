---
title: "Sin middleware por defecto"
sidebar:
  order: 1
---

Gin ofrece dos formas de crear un motor de enrutamiento, y la diferencia radica en qué middleware está adjunto por defecto.

### `gin.Default()` -- con Logger y Recovery

`gin.Default()` crea un enrutador con dos middleware ya adjuntos:

- **Logger** -- Escribe logs de solicitudes en stdout (método, ruta, código de estado, latencia).
- **Recovery** -- Se recupera de cualquier panic en los handlers y devuelve una respuesta 500, previniendo que tu servidor se caiga.

Esta es la opción más común para comenzar rápidamente.

### `gin.New()` -- un motor vacío

`gin.New()` crea un enrutador completamente vacío **sin middleware** adjunto. Esto es útil cuando quieres control total sobre qué middleware se ejecuta, por ejemplo:

- Quieres usar un logger estructurado (como `slog` o `zerolog`) en lugar del logger de texto predeterminado.
- Quieres personalizar el comportamiento de recuperación de panics.
- Estás construyendo un microservicio donde necesitas una pila de middleware mínima o especializada.

### Ejemplo

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

En el ejemplo anterior, el middleware Recovery está incluido para prevenir caídas, pero el middleware Logger predeterminado se omite. Podrías reemplazarlo con tu propio middleware de logging o dejarlo fuera completamente.
