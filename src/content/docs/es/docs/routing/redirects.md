---
title: "Redirecciones"
sidebar:
  order: 9
---

Gin admite tanto redirecciones HTTP (enviando al cliente a una URL diferente) como redirecciones de router (reenviando internamente una solicitud a un handler diferente sin un viaje de ida y vuelta al cliente).

## Redirecciones HTTP

Usa `c.Redirect` con un código de estado HTTP apropiado para redirigir al cliente:

- **301 (`http.StatusMovedPermanently`)** — el recurso se ha movido permanentemente. Los navegadores y motores de búsqueda actualizan sus cachés.
- **302 (`http.StatusFound`)** — redirección temporal. El navegador sigue pero no almacena en caché la nueva URL.
- **307 (`http.StatusTemporaryRedirect`)** — como 302, pero el navegador debe preservar el método HTTP original (útil para redirecciones POST).
- **308 (`http.StatusPermanentRedirect`)** — como 301, pero el navegador debe preservar el método HTTP original.

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

## Pruébalo

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
Al redirigir desde un handler POST, usa `302` o `307` en lugar de `301`. Una redirección `301` puede hacer que algunos navegadores cambien el método de POST a GET, lo que puede provocar comportamientos inesperados.
:::

:::tip
Las redirecciones internas mediante `router.HandleContext(c)` no envían una respuesta de redirección al cliente. La solicitud se redirige dentro del servidor, lo cual es más rápido e invisible para el cliente.
:::

## Ver también

- [Agrupar rutas](/es/docs/routing/grouping-routes/)
