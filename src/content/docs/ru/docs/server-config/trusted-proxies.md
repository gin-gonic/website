---
title: "Доверенные прокси"
sidebar:
  order: 8
---

Gin позволяет указать, какие заголовки содержат реальный IP клиента (если есть),
а также указать, каким прокси (или прямым клиентам) вы доверяете
устанавливать эти заголовки.

### Почему важна конфигурация доверенных прокси

Когда ваше приложение находится за обратным прокси (Nginx, HAProxy, облачным балансировщиком нагрузки и т.д.), прокси передаёт оригинальный IP-адрес клиента в заголовках, таких как `X-Forwarded-For` или `X-Real-Ip`. Проблема в том, что **любой клиент может установить эти заголовки**. Без правильной конфигурации доверенных прокси злоумышленник может подделать `X-Forwarded-For` чтобы:

- **Обойти контроль доступа на основе IP** -- Если ваше приложение ограничивает определённые маршруты внутренним диапазоном IP (например, `10.0.0.0/8`), злоумышленник может отправить `X-Forwarded-For: 10.0.0.1` с публичного IP и полностью обойти ограничение.
- **Отравить логи и аудиторские записи** -- Поддельные IP делают расследование инцидентов ненадёжным, поскольку вы больше не можете отследить запросы до реального источника.
- **Обойти ограничение частоты запросов** -- Если ограничение частоты привязано к `ClientIP()`, каждый запрос может заявить другой IP-адрес, чтобы избежать ограничения.

`SetTrustedProxies` решает эту проблему, сообщая Gin, какие сетевые адреса являются легитимными прокси. Когда `ClientIP()` разбирает цепочку `X-Forwarded-For`, он доверяет только записям, добавленным этими прокси, и отбрасывает всё, что мог добавить клиент. Если запрос приходит напрямую (не от доверенного прокси), заголовки перенаправления полностью игнорируются, и используется необработанный удалённый адрес.

Используйте функцию `SetTrustedProxies()` на вашем `gin.Engine` для указания сетевых адресов
или CIDR сетей, от которых можно доверять заголовкам запросов клиентов,
связанным с IP. Это могут быть IPv4-адреса, IPv4 CIDR, IPv6-адреса или
IPv6 CIDR.

**Внимание:** Gin по умолчанию доверяет всем прокси, если вы не укажете доверенный
прокси с помощью указанной функции, **это НЕ безопасно**. В то же время, если вы не
используете прокси, вы можете отключить эту функцию с помощью `Engine.SetTrustedProxies(nil)`,
тогда `Context.ClientIP()` будет возвращать удалённый адрес напрямую, избегая
ненужных вычислений.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**Примечание:** Если вы используете CDN-сервис, вы можете установить `Engine.TrustedPlatform`
для пропуска проверки TrustedProxies — он имеет более высокий приоритет, чем TrustedProxies.
Смотрите пример ниже:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
