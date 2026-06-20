---
title: "安全头"
sidebar:
  order: 7
---

使用安全头来保护你的 Web 应用免受常见安全漏洞非常重要。此示例展示了如何向 Gin 应用添加安全头，以及如何避免 Host Header 注入相关攻击（SSRF、开放重定向）。

### 每个头的保护作用

| 头 | 用途 |
|--------|---------|
| `X-Content-Type-Options: nosniff` | 防止 MIME 类型嗅探攻击。没有此头，浏览器可能将文件解释为与声明不同的内容类型，允许攻击者执行伪装成无害文件类型的恶意脚本（例如上传一个实际上是 JavaScript 的 `.jpg`）。 |
| `X-Frame-Options: DENY` | 通过禁止页面在 `<iframe>` 中加载来防止点击劫持。攻击者使用点击劫持在合法页面上覆盖不可见的框架，诱骗用户点击隐藏的按钮（例如"删除我的账户"）。 |
| `Content-Security-Policy` | 控制浏览器允许加载哪些资源（脚本、样式、图片、字体等）以及从哪些来源。这是防御跨站脚本（XSS）最有效的方式之一，因为它可以阻止内联脚本并限制脚本来源。 |
| `X-XSS-Protection: 1; mode=block` | 激活浏览器内置的 XSS 过滤器。此头在现代浏览器中已基本弃用（Chrome 在 2019 年移除了其 XSS Auditor），但它仍为使用旧浏览器的用户提供纵深防御。 |
| `Strict-Transport-Security` | 强制浏览器在指定的 `max-age` 期间对所有未来请求使用 HTTPS。这可以防止协议降级攻击和通过不安全 HTTP 连接的 cookie 劫持。`includeSubDomains` 指令将此保护扩展到所有子域。 |
| `Referrer-Policy: strict-origin` | 控制传出请求中发送多少引用者信息。没有此头，完整的 URL（包括可能包含令牌或敏感数据的查询参数）可能会泄露给第三方站点。`strict-origin` 仅发送来源（域名）且仅通过 HTTPS。 |
| `Permissions-Policy` | 限制页面可以使用哪些浏览器功能（地理位置、摄像头、麦克风等）。如果攻击者成功注入脚本，这可以限制损害，因为这些脚本无法访问敏感的设备 API。 |

### 示例

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // Setup Security Headers
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // listen and serve on 0.0.0.0:8080
}
```

你可以通过 `curl` 测试：

```bash
// Check Headers

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Check Host Header Injection

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

可选方案，使用 [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // Use default security headers
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
