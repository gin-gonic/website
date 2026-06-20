---
title: "服务器配置"
sidebar:
  order: 8
---

Gin 提供了灵活的服务器配置选项。由于 `gin.Engine` 实现了 `http.Handler` 接口，你可以将其与 Go 标准的 `net/http.Server` 一起使用，直接控制超时、TLS 和其他设置。

## 使用自定义 http.Server

默认情况下，`router.Run()` 会启动一个基本的 HTTP 服务器。对于生产环境，请创建自己的 `http.Server` 来设置超时和其他选项：

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

这样你可以充分利用 Go 的服务器配置，同时保留 Gin 的所有路由和中间件能力。

## 本节内容

- [**自定义 HTTP 配置**](./custom-http-config/) -- 微调底层 HTTP 服务器
- [**自定义 JSON 编解码器**](./custom-json-codec/) -- 使用替代 JSON 序列化库
- [**Let's Encrypt**](./lets-encrypt/) -- 使用 Let's Encrypt 自动获取 TLS 证书
- [**运行多个服务**](./multiple-service/) -- 在不同端口上运行多个 Gin 引擎
- [**优雅重启或停止**](./graceful-restart-or-stop/) -- 不中断活动连接地关闭服务
- [**HTTP/2 服务器推送**](./http2-server-push/) -- 主动向客户端推送资源
- [**Cookie 处理**](./cookie/) -- 读写 HTTP Cookie
- [**可信代理**](./trusted-proxies/) -- 配置 Gin 信任哪些代理来解析客户端 IP
