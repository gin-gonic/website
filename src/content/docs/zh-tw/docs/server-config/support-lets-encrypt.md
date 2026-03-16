---
title: "支援 Let's Encrypt"
sidebar:
  order: 3
---

[gin-gonic/autotls](https://github.com/gin-gonic/autotls) 套件透過 Let's Encrypt 提供自動 HTTPS。它會自動處理憑證的發行和更新，讓你可以用最少的配置提供 HTTPS 服務。

## 快速開始

最簡單的方式是使用你的路由器和一個或多個網域名稱呼叫 `autotls.Run`：

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

## 自訂自動憑證管理器

如需更多控制——例如指定憑證快取目錄或限制允許的主機名稱——請使用 `autotls.RunWithManager` 搭配自訂的 `autocert.Manager`：

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
Let's Encrypt 要求你的伺服器可以從公共網際網路透過連接埠 80 和 443 存取。這在 localhost 或阻擋入站連線的防火牆後面將無法運作。
:::

## 另請參閱

- [自訂 HTTP 配置](/zh-tw/docs/server-config/custom-http-config/)
