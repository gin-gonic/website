---
title: "安全最佳实践"
sidebar:
  order: 8
---

Web 应用是攻击者的主要目标。处理用户输入、存储数据或在反向代理后运行的 Gin 应用在进入生产环境之前需要有意的安全配置。本指南涵盖了最重要的防御措施，并展示如何使用 Gin 中间件和标准 Go 库来应用每项措施。

:::note
安全是分层的。本列表中没有任何单一技术本身就足够。应用所有相关部分以构建纵深防御。
:::

## CORS 配置

跨源资源共享（CORS）控制哪些外部域可以向你的 API 发出请求。配置错误的 CORS 可以允许恶意网站代表已认证用户读取你服务器的响应。

使用 [`gin-contrib/cors`](https://github.com/gin-contrib/cors) 包获得经过充分测试的解决方案。

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
永远不要将 `AllowOrigins: []string{"*"}` 与 `AllowCredentials: true` 一起使用。这会告诉浏览器任何站点都可以向你的 API 发送认证请求。
:::

## CSRF 保护

跨站请求伪造会诱骗已认证用户的浏览器向你的应用发送不需要的请求。任何依赖 cookie 进行认证的状态变更端点（POST、PUT、DELETE）都需要 CSRF 保护。

使用 [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) 中间件添加基于令牌的保护。

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
CSRF 保护对于使用基于 cookie 认证的应用至关重要。仅依赖 `Authorization` 头（例如 Bearer 令牌）的 API 不会受到 CSRF 攻击，因为浏览器不会自动附加这些头。
:::

## 限流

限流可以防止滥用、暴力攻击和资源耗尽。你可以使用标准库的 `golang.org/x/time/rate` 包构建一个简单的按客户端限流中间件。

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // Allow 10 requests per second with a burst of 20
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
上面的示例将限流器存储在内存映射中。在生产环境中，你应该添加定期清理过期条目的机制，如果你运行多个应用实例，请考虑使用分布式限流器（例如基于 Redis）。
:::

## 输入验证和 SQL 注入防护

始终使用 Gin 的模型绑定和结构体标签来验证和绑定输入。永远不要通过拼接用户输入来构造 SQL 查询。

### 使用结构体标签验证输入

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // req is now validated; proceed safely
}
```

### 使用参数化查询

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

这适用于每个数据库库。无论你使用 `database/sql`、GORM、sqlx 还是其他 ORM，都要使用参数占位符而不是字符串拼接。

:::note
输入验证和参数化查询是你对抗注入攻击的两个最重要的防御手段。单独使用任何一个都不够——请同时使用。
:::

## XSS 防护

跨站脚本（XSS）发生在攻击者注入恶意脚本并在其他用户的浏览器中执行时。在多个层面进行防御。

### 转义 HTML 输出

渲染 HTML 模板时，Go 的 `html/template` 包默认转义输出。如果你将用户提供的数据作为 JSON 返回，请确保正确设置 `Content-Type` 头，以便浏览器不会将 JSON 解释为 HTML。

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### 使用 SecureJSON 进行 JSONP 保护

Gin 提供了 `c.SecureJSON`，它在前面添加 `while(1);` 以防止 JSON 劫持。

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### 需要时显式设置 Content-Type

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

`X-Content-Type-Options: nosniff` 头可以防止浏览器进行 MIME 类型嗅探，阻止它们在服务器声明为其他类型时将响应解释为 HTML。

## 安全头中间件

添加安全头是最简单也是最有效的加固步骤之一。详细示例请参阅[安全头](/zh-cn/docs/middleware/security-headers/)页面。以下是基本头的简要概述。

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| 头 | 防护内容 |
|--------|-----------------|
| `X-Frame-Options: DENY` | 通过 iframe 的点击劫持 |
| `X-Content-Type-Options: nosniff` | MIME 类型嗅探攻击 |
| `Strict-Transport-Security` | 协议降级和 cookie 劫持 |
| `Content-Security-Policy` | XSS 和数据注入 |
| `Referrer-Policy` | 向第三方泄露敏感 URL 参数 |
| `Permissions-Policy` | 未授权使用浏览器 API（摄像头、麦克风等） |

## 可信代理

当你的应用在反向代理或负载均衡器后运行时，你必须告诉 Gin 信任哪些代理。没有此配置，攻击者可以伪造 `X-Forwarded-For` 头以绕过基于 IP 的访问控制和限流。

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

详细说明和配置选项请参阅[可信代理](/zh-cn/docs/server-config/trusted-proxies/)页面。

## HTTPS 和 TLS

所有生产环境的 Gin 应用都应该通过 HTTPS 提供流量。Gin 支持通过 Let's Encrypt 自动获取 TLS 证书。

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

完整的设置说明（包括自定义证书管理器）请参阅[支持 Let's Encrypt](/zh-cn/docs/server-config/support-lets-encrypt/) 页面。

:::note
始终将 HTTPS 与 `Strict-Transport-Security` 头（HSTS）结合使用，以防止协议降级攻击。一旦设置了 HSTS 头，浏览器将拒绝通过纯 HTTP 连接。
:::

## 另请参阅

- [安全头](/zh-cn/docs/middleware/security-headers/)
- [可信代理](/zh-cn/docs/server-config/trusted-proxies/)
- [支持 Let's Encrypt](/zh-cn/docs/server-config/support-lets-encrypt/)
- [自定义中间件](/zh-cn/docs/middleware/custom-middleware/)
- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
