---
title: "安全標頭"
sidebar:
  order: 7
---

使用安全標頭來保護你的 Web 應用程式免受常見安全漏洞非常重要。此範例展示了如何將安全標頭新增到你的 Gin 應用程式，以及如何避免與 Host 標頭注入相關的攻擊（SSRF、開放重新導向）。

### 每個標頭的防護作用

| 標頭 | 用途 |
|--------|---------|
| `X-Content-Type-Options: nosniff` | 防止 MIME 類型嗅探攻擊。沒有此標頭，瀏覽器可能會將檔案解釋為與宣告不同的內容類型，讓攻擊者可以將偽裝成無害檔案類型的惡意腳本執行（例如，上傳一個實際上是 JavaScript 的 `.jpg`）。 |
| `X-Frame-Options: DENY` | 透過禁止頁面在 `<iframe>` 中載入來防止點擊劫持。攻擊者使用點擊劫持在合法頁面上覆蓋不可見的框架，欺騙使用者點擊隱藏按鈕（例如「刪除我的帳戶」）。 |
| `Content-Security-Policy` | 控制瀏覽器允許載入哪些資源（腳本、樣式、圖片、字體等）以及從哪些來源載入。這是對抗跨站腳本（XSS）最有效的防禦之一，因為它可以阻止行內腳本並限制腳本來源。 |
| `X-XSS-Protection: 1; mode=block` | 啟用瀏覽器內建的 XSS 過濾器。此標頭在現代瀏覽器中已大致過時（Chrome 在 2019 年移除了 XSS 審計器），但仍為使用舊版瀏覽器的使用者提供深度防禦。 |
| `Strict-Transport-Security` | 強制瀏覽器在指定的 `max-age` 期間內對該網域的所有未來請求使用 HTTPS。這可以防止協定降級攻擊和不安全 HTTP 連線上的 Cookie 劫持。`includeSubDomains` 指令將此保護擴展到所有子網域。 |
| `Referrer-Policy: strict-origin` | 控制隨傳出請求傳送多少來源資訊。沒有此標頭，完整的 URL（包括可能包含令牌或敏感資料的查詢參數）可能會洩露給第三方網站。`strict-origin` 僅傳送來源（網域）且僅透過 HTTPS。 |
| `Permissions-Policy` | 限制頁面可以使用哪些瀏覽器功能（地理位置、相機、麥克風等）。這限制了攻擊者成功注入腳本後的損害，因為這些腳本無法存取敏感的裝置 API。 |

### 範例

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

你可以透過 `curl` 測試：

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

你也可以選擇使用 [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

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
