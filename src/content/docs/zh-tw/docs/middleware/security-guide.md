---
title: "安全最佳實務"
sidebar:
  order: 8
---

Web 應用程式是攻擊者的主要目標。處理使用者輸入、儲存資料或在反向代理後面運行的 Gin 應用程式，在上線之前需要審慎的安全配置。本指南涵蓋了最重要的防禦措施，並展示如何使用 Gin 中介軟體和標準 Go 函式庫來應用每一項。

:::note
安全是分層的。此列表中沒有任何單一技術本身就足夠。應用所有相關的部分來建構深度防禦。
:::

## CORS 配置

跨來源資源共享（CORS）控制哪些外部網域可以向你的 API 發送請求。配置錯誤的 CORS 可能允許惡意網站代表已認證的使用者讀取你伺服器的回應。

使用 [`gin-contrib/cors`](https://github.com/gin-contrib/cors) 套件來獲得經過充分測試的解決方案。

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
切勿同時使用 `AllowOrigins: []string{"*"}` 和 `AllowCredentials: true`。這會告訴瀏覽器任何網站都可以向你的 API 發送已認證的請求。
:::

## CSRF 保護

跨站請求偽造會欺騙已認證使用者的瀏覽器向你的應用程式傳送不需要的請求。任何依賴 Cookie 進行身份驗證的狀態變更端點（POST、PUT、DELETE）都需要 CSRF 保護。

使用 [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) 中介軟體來新增基於令牌的保護。

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
CSRF 保護對於使用基於 Cookie 的身份驗證的應用程式至關重要。僅依賴 `Authorization` 標頭（例如 Bearer 令牌）的 API 不容易受到 CSRF 攻擊，因為瀏覽器不會自動附加這些標頭。
:::

## 速率限制

速率限制可以防止濫用、暴力攻擊和資源耗盡。你可以使用標準函式庫的 `golang.org/x/time/rate` 套件來建構簡單的每客戶端速率限制器作為中介軟體。

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
上面的範例將限制器儲存在記憶體中的 map 中。在正式環境中，你應該新增過期條目的定期清理，並考慮使用分散式速率限制器（例如基於 Redis 的），如果你運行多個應用程式實例。
:::

## 輸入驗證和 SQL 注入防護

務必使用 Gin 的模型綁定搭配結構體標籤來驗證和綁定輸入。切勿透過串接使用者輸入來構造 SQL 查詢。

### 使用結構體標籤驗證輸入

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

### 使用參數化查詢

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

這適用於每個資料庫函式庫。無論你使用 `database/sql`、GORM、sqlx 或其他 ORM，都要使用參數佔位符，絕不使用字串串接。

:::note
輸入驗證和參數化查詢是你對抗注入攻擊的兩項最重要的防禦措施。單獨任何一個都不夠——兩者都要使用。
:::

## XSS 防護

跨站腳本（XSS）發生在攻擊者注入惡意腳本並在其他使用者的瀏覽器中執行時。在多個層面進行防禦。

### 跳脫 HTML 輸出

當渲染 HTML 模板時，Go 的 `html/template` 套件預設會跳脫輸出。如果你將使用者提供的資料作為 JSON 回傳，請確保 `Content-Type` 標頭設定正確，以便瀏覽器不會將 JSON 解釋為 HTML。

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### 使用 SecureJSON 進行 JSONP 保護

Gin 提供 `c.SecureJSON`，它會在前面加上 `while(1);` 以防止 JSON 劫持。

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### 在需要時明確設定 Content-Type

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

`X-Content-Type-Options: nosniff` 標頭防止瀏覽器進行 MIME 類型嗅探，阻止瀏覽器在伺服器宣告為其他類型時將回應解釋為 HTML。

## 安全標頭中介軟體

新增安全標頭是最簡單且最有效的強化步驟之一。請參閱完整的[安全標頭](/zh-tw/docs/middleware/security-headers/)頁面以獲取詳細範例。以下是基本標頭的快速摘要。

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

| 標頭 | 防護對象 |
|--------|-----------------|
| `X-Frame-Options: DENY` | 透過 iframe 的點擊劫持 |
| `X-Content-Type-Options: nosniff` | MIME 類型嗅探攻擊 |
| `Strict-Transport-Security` | 協定降級和 Cookie 劫持 |
| `Content-Security-Policy` | XSS 和資料注入 |
| `Referrer-Policy` | 洩露敏感 URL 參數給第三方 |
| `Permissions-Policy` | 未經授權使用瀏覽器 API（相機、麥克風等） |

## 受信任代理

當你的應用程式在反向代理或負載均衡器後面運行時，你必須告訴 Gin 哪些代理是受信任的。如果沒有此配置，攻擊者可以偽造 `X-Forwarded-For` 標頭來繞過基於 IP 的存取控制和速率限制。

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

請參閱[受信任代理](/zh-tw/docs/server-config/trusted-proxies/)頁面以獲取完整說明和配置選項。

## HTTPS 和 TLS

所有正式環境的 Gin 應用程式都應透過 HTTPS 提供流量。Gin 透過 Let's Encrypt 支援自動 TLS 憑證。

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

請參閱[支援 Let's Encrypt](/zh-tw/docs/server-config/support-lets-encrypt/) 頁面以獲取完整的設定說明，包括自訂憑證管理器。

:::note
務必將 HTTPS 與 `Strict-Transport-Security` 標頭（HSTS）結合使用，以防止協定降級攻擊。一旦設定了 HSTS 標頭，瀏覽器將拒絕透過純 HTTP 連線。
:::

## 另請參閱

- [安全標頭](/zh-tw/docs/middleware/security-headers/)
- [受信任代理](/zh-tw/docs/server-config/trusted-proxies/)
- [支援 Let's Encrypt](/zh-tw/docs/server-config/support-lets-encrypt/)
- [自訂中介軟體](/zh-tw/docs/middleware/custom-middleware/)
- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
