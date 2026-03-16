---
title: "Configuración HTTP personalizada"
sidebar:
  order: 1
---

Por defecto, `router.Run()` inicia un servidor HTTP básico. Para uso en producción, puede que necesites personalizar los tiempos de espera, límites de encabezados o configuración TLS. Puedes hacerlo creando tu propio `http.Server` y pasando el router de Gin como el `Handler`.

## Uso básico

Pasa el router de Gin directamente a `http.ListenAndServe`:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## Con configuración de servidor personalizada

Crea un struct `http.Server` para configurar los tiempos de espera de lectura/escritura y otras opciones:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## Pruébalo

```sh
curl http://localhost:8080/ping
# Output: pong
```

## Ver también

- [Reinicio o parada elegante](/es/docs/server-config/graceful-restart-or-stop/)
- [Ejecutar múltiples servicios](/es/docs/server-config/run-multiple-service/)
