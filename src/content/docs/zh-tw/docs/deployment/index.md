---
title: "部署"
sidebar:
  order: 10
---

Gin 專案可以輕鬆部署到任何雲端服務供應商。

## [Railway](https://www.railway.com)

Railway 是一個尖端的雲端開發平台，用於部署、管理和擴展應用程式及服務。它透過單一、可擴展、易於使用的平台簡化了從伺服器到可觀測性的基礎設施堆疊。

請按照 Railway 的[指南來部署你的 Gin 專案](https://docs.railway.com/guides/gin)。

## [Seenode](https://seenode.com)

Seenode 是一個專為希望快速高效部署應用程式的開發者設計的現代雲端平台。它提供基於 Git 的部署、自動 SSL 憑證、內建資料庫和簡化的介面，讓你的 Gin 應用程式在幾分鐘內上線。

請按照 Seenode 的[指南來部署你的 Gin 專案](https://seenode.com/docs/frameworks/go/gin)。

## [Koyeb](https://www.koyeb.com)

Koyeb 是一個開發者友好的無伺服器平台，支援全球部署應用程式，具有基於 Git 的部署、TLS 加密、原生自動擴展、全球邊緣網路和內建的服務網格與發現。

請按照 Koyeb 的[指南來部署你的 Gin 專案](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb)。

## [Qovery](https://www.qovery.com)

Qovery 提供免費的雲端託管，附帶資料庫、SSL、全球 CDN 和使用 Git 的自動部署。

請參閱 [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) 以獲取更多資訊。

## [Render](https://render.com)

Render 是一個現代雲端平台，原生支援 Go，提供完全託管的 SSL、資料庫、零停機部署、HTTP/2 和 WebSocket 支援。

請按照 Render 的[指南來部署 Gin 專案](https://render.com/docs/deploy-go-gin)。

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 有兩種部署 Go 應用程式的方式。標準環境更容易使用但自訂性較低，且出於安全原因防止了 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。靈活環境可以執行任何框架或函式庫。

在 [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多並選擇你偏好的環境。

## 自行託管

Gin 專案也可以以自行託管的方式部署。部署架構和安全考量因目標環境而異。以下部分僅提供規劃部署時需要考慮的配置選項的概要。

## 配置選項

Gin 專案部署可以透過環境變數或直接在程式碼中進行調整。

以下環境變數可用於配置 Gin：

| 環境變數 | 說明 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | 使用 `router.Run()`（即不帶任何參數）啟動 Gin 伺服器時要監聽的 TCP 連接埠。 |
| GIN_MODE             | 設為 `debug`、`release` 或 `test` 之一。處理 Gin 模式的管理，例如何時輸出除錯資訊。也可以在程式碼中使用 `gin.SetMode(gin.ReleaseMode)` 或 `gin.SetMode(gin.TestMode)` 設定。 |

以下程式碼可用於配置 Gin。

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

如需配置受信任代理的資訊，請參閱[受信任代理](/zh-tw/docs/server-config/trusted-proxies/)。
