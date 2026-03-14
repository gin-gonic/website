---
title: "受信任代理"
sidebar:
  order: 8
---

Gin 讓你可以指定哪些標頭用來取得真實的客戶端 IP（如果有的話），以及指定哪些代理（或直接客戶端）可以信任地提供這些標頭。

### 為什麼受信任代理配置很重要

當你的應用程式位於反向代理（Nginx、HAProxy、雲端負載均衡器等）後面時，代理會在 `X-Forwarded-For` 或 `X-Real-Ip` 等標頭中轉發原始客戶端的 IP 位址。問題是**任何客戶端都可以設定這些標頭**。如果沒有正確的受信任代理配置，攻擊者可以偽造 `X-Forwarded-For` 來：

- **繞過基於 IP 的存取控制** -- 如果你的應用程式限制某些路由只能由內部 IP 範圍（例如 `10.0.0.0/8`）存取，攻擊者可以從公共 IP 傳送 `X-Forwarded-For: 10.0.0.1` 來完全繞過限制。
- **污染日誌和稽核記錄** -- 偽造的 IP 使事件調查變得不可靠，因為你無法再將請求追溯到真實來源。
- **規避速率限制** -- 如果速率限制是基於 `ClientIP()` 的，每個請求都可以聲稱不同的 IP 位址來避免被限流。

`SetTrustedProxies` 透過告訴 Gin 哪些網路位址是合法的代理來解決這個問題。當 `ClientIP()` 解析 `X-Forwarded-For` 鏈時，它只信任那些代理新增的條目，並丟棄客戶端可能預先加入的任何內容。如果請求直接到達（不是來自受信任的代理），轉發標頭會被完全忽略，使用原始的遠端位址。

在你的 `gin.Engine` 上使用 `SetTrustedProxies()` 函式來指定網路位址或網路 CIDR，從這些位址來的客戶端的請求標頭（與客戶端 IP 相關的）可以被信任。它們可以是 IPv4 位址、IPv4 CIDR、IPv6 位址或 IPv6 CIDR。

**注意：** 如果你不使用上述函式指定受信任代理，Gin 預設會信任所有代理，**這是不安全的**。同時，如果你不使用任何代理，你可以透過使用 `Engine.SetTrustedProxies(nil)` 停用此功能，那麼 `Context.ClientIP()` 將直接回傳遠端位址以避免一些不必要的運算。

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

**注意：** 如果你使用 CDN 服務，你可以設定 `Engine.TrustedPlatform` 來跳過 TrustedProxies 檢查，它的優先級高於 TrustedProxies。請看以下範例：

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
