---
title: "Soporte para Let's Encrypt"
sidebar:
  order: 3
---

El paquete [gin-gonic/autotls](https://github.com/gin-gonic/autotls) proporciona HTTPS automático mediante Let's Encrypt. Maneja la emisión y renovación de certificados automáticamente, para que puedas servir HTTPS con configuración mínima.

## Inicio rápido

La forma más sencilla es llamar a `autotls.Run` con tu router y uno o más nombres de dominio:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  log.Fatal(autotls.Run(router, "example1.com", "example2.com"))
}
```

## Gestor de autocert personalizado

Para más control — como especificar un directorio de caché de certificados o restringir los nombres de host permitidos — usa `autotls.RunWithManager` con un `autocert.Manager` personalizado:

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
  "golang.org/x/crypto/acme/autocert"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  m := autocert.Manager{
    Prompt:     autocert.AcceptTOS,
    HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
    Cache:      autocert.DirCache("/var/www/.cache"),
  }

  log.Fatal(autotls.RunWithManager(router, &m))
}
```

:::note
Let's Encrypt requiere que tu servidor sea accesible en los puertos 80 y 443 desde la internet pública. Esto no funcionará en localhost o detrás de un firewall que bloquee conexiones entrantes.
:::

## Ver también

- [Configuración HTTP personalizada](/es/docs/server-config/custom-http-config/)
