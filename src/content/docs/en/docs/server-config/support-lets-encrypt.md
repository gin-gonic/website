---
title: "Support Let's Encrypt"
sidebar:
  order: 3
---

The [gin-gonic/autotls](https://github.com/gin-gonic/autotls) package provides automatic HTTPS via Let's Encrypt. It handles certificate issuance and renewal automatically, so you can serve HTTPS with minimal configuration.

## Quick start

The simplest way is to call `autotls.Run` with your router and one or more domain names:

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

## Custom autocert manager

For more control — such as specifying a certificate cache directory or restricting allowed hostnames — use `autotls.RunWithManager` with a custom `autocert.Manager`:

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
Let's Encrypt requires that your server is reachable on port 80 and 443 from the public internet. This will not work on localhost or behind a firewall that blocks inbound connections.
:::

## See also

- [Custom HTTP configuration](/en/docs/server-config/custom-http-config/)
