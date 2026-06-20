---
title: "デプロイメント"
sidebar:
  order: 10
---

Ginプロジェクトはあらゆるクラウドプロバイダーに簡単にデプロイできます。

## [Railway](https://www.railway.com)

Railway is a cutting-edge cloud development platform for deploying, managing, and scaling applications and services. It simplifies your infrastructure stack from servers to observability with a single, scalable, easy-to-use platform.

Follow the Railway [guide to deploy your Gin projects](https://docs.railway.com/guides/gin).

## [Seenode](https://seenode.com)

Seenode is a modern cloud platform designed specifically for developers who want to deploy applications quickly and efficiently. It offers git-based deployment, automatic SSL certificates, built-in databases, and a streamlined interface that gets your Gin applications live in minutes.

Follow the Seenode [guide to deploy your Gin projects](https://seenode.com/docs/frameworks/go/gin).

## [Koyeb](https://www.koyeb.com)

Koyeb is a developer-friendly serverless platform to deploy apps globally with git-based deployment, TLS encryption, native autoscaling, a global edge network, and built-in service mesh & discovery.

Follow the Koyeb [guide to deploy your Gin projects](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery provides free Cloud hosting with databases, SSL, a global CDN, and automatic deploys with Git.

See [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) for more information.

## [Render](https://render.com)

Render is a modern cloud platform that offers native support for Go, fully managed SSL, databases, zero-downtime deploys, HTTP/2, and websocket support.

Follow the Render [guide to deploying Gin projects](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE has two ways to deploy Go applications. The standard environment is easier to use but less customizable and prevents [syscalls](https://github.com/gin-gonic/gin/issues/1639) for security reasons. The flexible environment can run any framework or library.

Learn more and pick your preferred environment at [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/).

## セルフホスト

Ginプロジェクトはセルフホスト方式でもデプロイできます。デプロイアーキテクチャとセキュリティの考慮事項はターゲット環境によって異なります。以下のセクションでは、デプロイを計画する際に検討すべき設定オプションの概要のみを提示します。

## 設定オプション

Ginプロジェクトのデプロイは、環境変数またはコード内で直接チューニングできます。

Ginの設定に利用可能な環境変数は以下の通りです：

| Environment Variable | Description                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | The TCP port to listen on when starting the Gin server with `router.Run()` (i.e. without any arguments).                                                                                                      |
| GIN_MODE             | Set to one of `debug`, `release`, or `test`. Handles management of Gin modes, such as when to emit debug outputs. Can also be set in code using `gin.SetMode(gin.ReleaseMode)` or `gin.SetMode(gin.TestMode)` |

以下のコードでGinを設定できます。

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

信頼済みプロキシの設定については、[信頼済みプロキシ](/ja/docs/server-config/trusted-proxies/)を参照してください。
