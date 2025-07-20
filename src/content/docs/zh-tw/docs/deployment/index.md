---
title: "部署"
sidebar:
  order: 6
---

Gin 專案可以輕鬆部署到任意雲主機商。

## [Koyeb](https://www.koyeb.com)

Koyeb 是一個開發者友善的無伺服器平台，可透過基於 Git 的部署在全球部署應用程式，支援 TLS 加密、本地自動擴展、全球邊緣網絡，以及內建的服務網格與發現功能。

請參照 Koyeb [指南部署您的 Gin 專案](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb)。

## [Qovery](https://www.qovery.com)

Qovery 提供免費的雲端主機托管，包括資料庫、SSL、全球 CDN，以及使用 Git 進行自動部署。

請參照 Qovery 指南來[部署您的 Gin 項目](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/)。

## [Render](https://render.com)

Render 是一個原生支援 Go 語言的現代化雲平台，並支持管理 SSL、資料庫、不停機部署、HTTP/2 和 websocket。

請參考 Render 文件[部署 Gin 專案](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 提供兩種方式部署 Go 應用。標準環境使用上較為簡單，但客製化程度較低，且出於安全考量禁止使用 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。在靈活的環境中，您可以執行任何框架和套件。

前往 [Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多並選擇您喜歡的環境。

## 自主部署

Gin 專案也可以採用自主部署的方式。部署架構和安全性考量會依據目標環境而有所不同。以下章節僅提供規劃部署時需要考慮的設定選項概觀。

## 設定選項

Gin 專案部署可以透過環境變數或直接在程式碼中進行調整。

以下是可用於設定 Gin 的環境變數：

| 環境變數 | 說明                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT     | 使用 `router.Run()` 啟動 Gin 伺服器時要監聽的 TCP 連接埠（即不帶任何參數時）。                                                                                              |
| GIN_MODE | 可設定為 `debug`、`release` 或 `test`。用於管理 Gin 模式，例如是否輸出除錯資訊。也可以在程式碼中使用 `gin.SetMode(gin.ReleaseMode)` 或 `gin.SetMode(gin.TestMode)` 來設定。 |

以下程式碼可用於設定 Gin：

```go
// 不指定 Gin 的綁定位址或連接埠。預設會綁定在所有介面的 8080 連接埠。
// 使用不帶參數的 `Run()` 時可透過 `PORT` 環境變數更改監聽連接埠。
router := gin.Default()
router.Run()

// 指定 Gin 的綁定位址和連接埠。
router := gin.Default()
router.Run("192.168.1.100:8080")

// 只指定監聽連接埠。將綁定在所有介面。
router := gin.Default()
router.Run(":8080")

// 設定哪些 IP 位址或 CIDR 被視為可信任的代理，用於設定紀錄真實客戶端 IP 的標頭。
// 詳細資訊請參閱文件。
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

## 不要信任所有代理

Gin 允許您指定哪些標頭可以保存真實的客戶端 IP（如果有的話），以及指定您信任哪些代理（或直接客戶端）可以設定這些標頭。

在 `gin.Engine` 上使用 `SetTrustedProxies()` 函式來指定可信任的網路位址或網路 CIDR，這些來源的請求標頭中與客戶端 IP 相關的資訊將被視為可信任。可以是 IPv4 位址、IPv4 CIDR、IPv6 位址或 IPv6 CIDR。

**注意：** 如果您沒有使用上述函式指定可信任的代理，Gin 預設會信任所有代理，這是**不安全的**。同時，如果您不使用任何代理，可以使用 `Engine.SetTrustedProxies(nil)` 來停用此功能，這樣 `Context.ClientIP()` 將直接回傳遠端位址，避免不必要的運算。

```go
import (
    "fmt"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()
    router.SetTrustedProxies([]string{"192.168.1.2"})

    router.GET("/", func(c *gin.Context) {
        // 如果客戶端是 192.168.1.2，則使用 X-Forwarded-For
        // 標頭中可信任的部分來推斷原始客戶端 IP。
        // 否則，直接回傳客戶端 IP
        fmt.Printf("ClientIP: %s\n", c.ClientIP())
    })
    router.Run()
}
```

**提醒：** 如果您使用 CDN 服務，可以設定 `Engine.TrustedPlatform` 來跳過 TrustedProxies 檢查，它的優先順序高於 TrustedProxies。
請看以下範例：

```go
import (
    "fmt"

    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()
    // 使用預定義的標頭 gin.PlatformXXX
    // Google App Engine
    router.TrustedPlatform = gin.PlatformGoogleAppEngine
    // Cloudflare
    router.TrustedPlatform = gin.PlatformCloudflare
    // Fly.io
    router.TrustedPlatform = gin.PlatformFlyIO
    // 或者，您可以設定自己的可信任請求標頭。但請確保您的 CDN
    // 會防止使用者傳遞此標頭！例如，如果您的 CDN 將客戶端 IP
    // 放在 X-CDN-Client-IP 中：
    router.TrustedPlatform = "X-CDN-Client-IP"

    router.GET("/", func(c *gin.Context) {
        // 如果您設定了 TrustedPlatform，ClientIP() 將會解析
        // 對應的標頭並直接回傳 IP
        fmt.Printf("ClientIP: %s\n", c.ClientIP())
    })
    router.Run()
}
```
