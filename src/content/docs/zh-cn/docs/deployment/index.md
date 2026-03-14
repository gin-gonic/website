---
title: "部署"
sidebar:
  order: 10
---

Gin 项目可以轻松部署到任何云服务提供商。

## [Railway](https://www.railway.com)

Railway 是一个前沿的云开发平台，用于部署、管理和扩展应用和服务。它通过一个可扩展、易于使用的平台简化了从服务器到可观测性的整个基础设施栈。

请参阅 Railway [部署 Gin 项目的指南](https://docs.railway.com/guides/gin)。

## [Seenode](https://seenode.com)

Seenode 是一个专为希望快速高效部署应用的开发者设计的现代云平台。它提供基于 Git 的部署、自动 SSL 证书、内置数据库和简洁的界面，让你的 Gin 应用在几分钟内上线。

请参阅 Seenode [部署 Gin 项目的指南](https://seenode.com/docs/frameworks/go/gin)。

## [Koyeb](https://www.koyeb.com)

Koyeb 是一个开发者友好的 Serverless 平台，支持基于 Git 的部署、TLS 加密、原生自动扩展、全球边缘网络以及内置的服务网格和服务发现，可在全球范围内部署应用。

请参阅 Koyeb [部署 Gin 项目的指南](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb)。

## [Qovery](https://www.qovery.com)

Qovery 提供免费的云托管服务，包含数据库、SSL、全球 CDN 和基于 Git 的自动部署。

更多信息请参阅 [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/)。

## [Render](https://render.com)

Render 是一个现代云平台，提供对 Go 的原生支持、完全托管的 SSL、数据库、零停机部署、HTTP/2 和 WebSocket 支持。

请参阅 Render [部署 Gin 项目的指南](https://render.com/docs/deploy-go-gin)。

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 有两种方式来部署 Go 应用。标准环境更易于使用，但自定义性较低，并且出于安全原因会阻止 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。灵活环境可以运行任何框架或库。

在 [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多信息并选择你偏好的环境。

## 自托管

Gin 项目也可以以自托管的方式部署。部署架构和安全考虑因目标环境而异。以下部分仅概述了在规划部署时需要考虑的配置选项。

## 配置选项

Gin 项目的部署可以通过环境变量或直接在代码中进行调整。

以下环境变量可用于配置 Gin：

| 环境变量 | 描述 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | 使用 `router.Run()`（即不带任何参数）启动 Gin 服务器时要监听的 TCP 端口。 |
| GIN_MODE             | 设置为 `debug`、`release` 或 `test` 之一。用于管理 Gin 模式，例如何时输出调试信息。也可以在代码中使用 `gin.SetMode(gin.ReleaseMode)` 或 `gin.SetMode(gin.TestMode)` 设置。 |

以下代码可用于配置 Gin。

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

有关配置可信代理的信息，请参阅[可信代理](/zh-cn/docs/server-config/trusted-proxies/)。
