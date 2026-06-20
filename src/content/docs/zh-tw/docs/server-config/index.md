---
title: "伺服器配置"
sidebar:
  order: 8
---

Gin 提供靈活的伺服器配置選項。由於 `gin.Engine` 實作了 `http.Handler` 介面，你可以將其與 Go 的標準 `net/http.Server` 一起使用，直接控制逾時、TLS 和其他設定。

## 使用自訂 http.Server

預設情況下，`router.Run()` 啟動一個基本的 HTTP 伺服器。對於正式環境使用，建立你自己的 `http.Server` 來設定逾時和其他選項：

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

這讓你能完全存取 Go 的伺服器配置，同時保留 Gin 的所有路由和中介軟體功能。

## 本節內容

- [**自訂 HTTP 配置**](./custom-http-config/) -- 微調底層 HTTP 伺服器
- [**自訂 JSON 編解碼器**](./custom-json-codec/) -- 使用替代的 JSON 序列化函式庫
- [**Let's Encrypt**](./lets-encrypt/) -- 使用 Let's Encrypt 自動取得 TLS 憑證
- [**執行多個服務**](./multiple-service/) -- 在不同連接埠上執行多個 Gin 引擎
- [**優雅地重啟或停止**](./graceful-restart-or-stop/) -- 不中斷活躍連線地關閉伺服器
- [**HTTP/2 伺服器推送**](./http2-server-push/) -- 主動將資源推送給客戶端
- [**Cookie 處理**](./cookie/) -- 讀取和寫入 HTTP Cookie
- [**受信任代理**](./trusted-proxies/) -- 配置 Gin 信任哪些代理來解析客戶端 IP
