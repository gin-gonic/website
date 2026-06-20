---
title: "Ejecutar múltiples servicios"
sidebar:
  order: 4
---

Puedes ejecutar múltiples servidores Gin en el mismo proceso — cada uno en un puerto diferente — usando `errgroup.Group` del paquete `golang.org/x/sync/errgroup`. Esto es útil cuando necesitas exponer APIs separadas (por ejemplo, una API pública en el puerto 8080 y una API de administración en el puerto 8081) sin desplegar binarios separados.

Cada servidor obtiene su propio router, pila de middleware y configuración de `http.Server`.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## Pruébalo

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
Si alguno de los servidores falla al iniciar (por ejemplo, si un puerto ya está en uso), `g.Wait()` devuelve el primer error. Ambos servidores deben iniciar exitosamente para que el proceso continúe ejecutándose.
:::

## Ver también

- [Configuración HTTP personalizada](/es/docs/server-config/custom-http-config/)
- [Reinicio o parada elegante](/es/docs/server-config/graceful-restart-or-stop/)
