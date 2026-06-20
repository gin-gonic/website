---
title: "Let's Encrypt desteği"
sidebar:
  order: 3
---

[gin-gonic/autotls](https://github.com/gin-gonic/autotls) paketi, Let's Encrypt aracılığıyla otomatik HTTPS sağlar. Sertifika düzenleme ve yenilemeyi otomatik olarak yönetir, böylece minimum yapılandırmayla HTTPS sunabilirsiniz.

## Hızlı başlangıç

En basit yol, yönlendiriciniz ve bir veya daha fazla alan adıyla `autotls.Run` çağırmaktır:

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

## Özel otomatik sertifika yöneticisi

Daha fazla kontrol için — sertifika önbellek dizini belirlemek veya izin verilen ana bilgisayar adlarını kısıtlamak gibi — özel bir `autocert.Manager` ile `autotls.RunWithManager` kullanın:

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
Let's Encrypt, sunucunuzun genel internetten 80 ve 443 numaralı portlarda erişilebilir olmasını gerektirir. Bu, localhost'ta veya gelen bağlantıları engelleyen bir güvenlik duvarının arkasında çalışmaz.
:::

## Ayrıca bakınız

- [Özel HTTP yapılandırması](/tr/docs/server-config/custom-http-config/)
