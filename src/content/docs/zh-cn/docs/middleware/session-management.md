---
title: "会话管理"
sidebar:
  order: 9
---

会话允许你跨多个 HTTP 请求存储用户特定的数据。由于 HTTP 是无状态的，会话使用 cookie 或其他机制来识别回访用户并检索其存储的数据。

## 使用 gin-contrib/sessions

[gin-contrib/sessions](https://github.com/gin-contrib/sessions) 中间件提供了支持多种后端存储的会话管理：

```sh
go get github.com/gin-contrib/sessions
```

### 基于 Cookie 的会话

最简单的方式是将会话数据存储在加密的 cookie 中：

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Create cookie-based session store with a secret key
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### 基于 Redis 的会话

对于生产应用，将会话存储在 Redis 中以实现跨多个实例的可扩展性：

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Connect to Redis for session storage
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## 会话选项

使用 `sessions.Options` 配置会话行为：

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // Session expires in 1 hour (seconds)
  HttpOnly: true,        // Prevent JavaScript access
  Secure:   true,        // Only send over HTTPS
  SameSite: http.SameSiteLaxMode,
})
```

| 选项 | 描述 |
|--------|-------------|
| `Path` | Cookie 路径范围（默认：`/`） |
| `MaxAge` | 生命周期（秒）。使用 `-1` 删除，`0` 为浏览器会话 |
| `HttpOnly` | 防止 JavaScript 访问 cookie |
| `Secure` | 仅通过 HTTPS 发送 cookie |
| `SameSite` | 控制跨站 cookie 行为（`Lax`、`Strict`、`None`） |

:::note
在生产环境中始终设置 `HttpOnly: true` 和 `Secure: true`，以保护会话 cookie 免受 XSS 和中间人攻击。
:::

## 可用后端

| 后端 | 包 | 用例 |
|---------|---------|----------|
| Cookie | `sessions/cookie` | 简单应用，小型会话数据 |
| Redis | `sessions/redis` | 生产环境，多实例部署 |
| Memcached | `sessions/memcached` | 高性能缓存层 |
| MongoDB | `sessions/mongo` | MongoDB 为主要数据存储时 |
| PostgreSQL | `sessions/postgres` | PostgreSQL 为主要数据存储时 |

## 会话 vs JWT

| 方面 | 会话 | JWT |
|--------|----------|-----|
| 存储 | 服务端（Redis、数据库） | 客户端（令牌） |
| 撤销 | 简单（从存储中删除） | 困难（需要黑名单） |
| 可扩展性 | 需要共享存储 | 无状态 |
| 数据大小 | 服务端无限制 | 受令牌大小限制 |

当你需要轻松撤销时使用会话（例如注销、封禁用户）。当你需要跨微服务的无状态认证时使用 JWT。

## 另请参阅

- [Cookie 处理](/zh-cn/docs/server-config/cookie/)
- [安全最佳实践](/zh-cn/docs/middleware/security-guide/)
- [使用中间件](/zh-cn/docs/middleware/using-middleware/)
