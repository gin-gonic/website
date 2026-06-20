---
title: "Session 管理"
sidebar:
  order: 9
---

Session 讓你可以跨多個 HTTP 請求儲存使用者特定的資料。由於 HTTP 是無狀態的，Session 使用 Cookie 或其他機制來識別回訪的使用者並擷取其儲存的資料。

## 使用 gin-contrib/sessions

[gin-contrib/sessions](https://github.com/gin-contrib/sessions) 中介軟體提供了多種後端儲存的 Session 管理：

```sh
go get github.com/gin-contrib/sessions
```

### 基於 Cookie 的 Session

最簡單的方式是將 Session 資料儲存在加密的 Cookie 中：

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

### 基於 Redis 的 Session

對於正式環境應用程式，將 Session 儲存在 Redis 中以便跨多個實例擴展：

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

## Session 選項

使用 `sessions.Options` 配置 Session 行為：

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

| 選項 | 說明 |
|--------|-------------|
| `Path` | Cookie 路徑範圍（預設：`/`） |
| `MaxAge` | 存活時間（秒）。使用 `-1` 刪除，`0` 為瀏覽器 Session |
| `HttpOnly` | 防止 JavaScript 存取 Cookie |
| `Secure` | 僅透過 HTTPS 傳送 Cookie |
| `SameSite` | 控制跨站 Cookie 行為（`Lax`、`Strict`、`None`） |

:::note
在正式環境中務必設定 `HttpOnly: true` 和 `Secure: true`，以保護 Session Cookie 免受 XSS 和中間人攻擊。
:::

## 可用的後端

| 後端 | 套件 | 使用情境 |
|---------|---------|----------|
| Cookie | `sessions/cookie` | 簡單應用、小量 Session 資料 |
| Redis | `sessions/redis` | 正式環境、多實例部署 |
| Memcached | `sessions/memcached` | 高效能快取層 |
| MongoDB | `sessions/mongo` | 當 MongoDB 是你的主要資料儲存 |
| PostgreSQL | `sessions/postgres` | 當 PostgreSQL 是你的主要資料儲存 |

## Session 與 JWT 的比較

| 面向 | Session | JWT |
|--------|----------|-----|
| 儲存 | 伺服器端（Redis、資料庫） | 客戶端（令牌） |
| 撤銷 | 容易（從儲存中刪除） | 困難（需要黑名單） |
| 擴展性 | 需要共享儲存 | 無狀態 |
| 資料大小 | 伺服器端無限制 | 受令牌大小限制 |

當你需要容易撤銷時（例如登出、封鎖使用者）使用 Session。當你需要跨微服務的無狀態身份驗證時使用 JWT。

## 另請參閱

- [Cookie 處理](/zh-tw/docs/server-config/cookie/)
- [安全最佳實務](/zh-tw/docs/middleware/security-guide/)
- [使用中介軟體](/zh-tw/docs/middleware/using-middleware/)
