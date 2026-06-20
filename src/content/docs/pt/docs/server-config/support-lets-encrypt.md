---
title: "Suporte ao Let's Encrypt"
sidebar:
  order: 3
---

O pacote [gin-gonic/autotls](https://github.com/gin-gonic/autotls) fornece HTTPS automático via Let's Encrypt. Ele lida com a emissão e renovação de certificados automaticamente, para que você possa servir HTTPS com configuração mínima.

## Início rápido

A forma mais simples é chamar `autotls.Run` com seu router e um ou mais nomes de domínio:

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

## Gerenciador de autocert customizado

Para mais controle — como especificar um diretório de cache de certificados ou restringir nomes de host permitidos — use `autotls.RunWithManager` com um `autocert.Manager` customizado:

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
O Let's Encrypt requer que seu servidor esteja acessível nas portas 80 e 443 pela internet pública. Isso não funcionará em localhost ou atrás de um firewall que bloqueie conexões de entrada.
:::

## Veja também

- [Configuração HTTP customizada](/pt/docs/server-config/custom-http-config/)
