---
title: "Поддержка Let's Encrypt"
sidebar:
  order: 3
---

Пакет [gin-gonic/autotls](https://github.com/gin-gonic/autotls) обеспечивает автоматический HTTPS через Let's Encrypt. Он автоматически обрабатывает выпуск и обновление сертификатов, позволяя обслуживать HTTPS с минимальной конфигурацией.

## Быстрый старт

Самый простой способ — вызвать `autotls.Run` с вашим маршрутизатором и одним или несколькими доменными именами:

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

## Пользовательский менеджер автосертификатов

Для большего контроля — например, указания каталога кэша сертификатов или ограничения разрешённых имён хостов — используйте `autotls.RunWithManager` с пользовательским `autocert.Manager`:

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
Let's Encrypt требует, чтобы ваш сервер был доступен на портах 80 и 443 из публичного интернета. Это не будет работать на localhost или за брандмауэром, блокирующим входящие соединения.
:::

## Смотрите также

- [Пользовательская конфигурация HTTP](/ru/docs/server-config/custom-http-config/)
