---
title: "常見問題"
sidebar:
  order: 15
---

## 一般問題

### 如何在開發期間啟用即時重新載入？

使用 [Air](https://github.com/air-verse/air) 在開發期間自動即時重新載入。Air 會監視你的檔案，並在偵測到變更時重新建構/重新啟動你的應用程式。

**安裝：**

```sh
go install github.com/air-verse/air@latest
```

**設定：**

在你的專案根目錄建立 `.air.toml` 配置檔：

```sh
air init
```

然後在專案目錄中執行 `air` 取代 `go run`：

```sh
air
```

Air 會監視你的 `.go` 檔案並自動重新建構/重新啟動你的 Gin 應用程式。請參閱 [Air 文件](https://github.com/air-verse/air) 了解配置選項。

### 如何在 Gin 中處理 CORS？

使用官方的 [gin-contrib/cors](https://github.com/gin-contrib/cors) 中介軟體：

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Default CORS configuration
  r.Use(cors.Default())

  // Or customize CORS settings
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

如需完整的安全概述，請參閱[安全最佳實務](/zh-tw/docs/middleware/security-guide/)。

### 如何提供靜態檔案？

使用 `Static()` 或 `StaticFS()` 來提供靜態檔案：

```go
func main() {
  r := gin.Default()

  // Serve files from ./assets directory at /assets/*
  r.Static("/assets", "./assets")

  // Serve a single file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Serve from embedded filesystem (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

請參閱[從檔案提供資料](/zh-tw/docs/rendering/serving-data-from-file/)了解更多細節。

### 如何處理檔案上傳？

使用 `FormFile()` 處理單一檔案，或使用 `MultipartForm()` 處理多個檔案：

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// Multiple files upload
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

請參閱[檔案上傳](/zh-tw/docs/routing/upload-file/)文件了解更多細節。

### 如何使用 JWT 實作身份驗證？

使用 [gin-contrib/jwt](https://github.com/gin-contrib/jwt) 或實作自訂中介軟體。以下是一個最小範例：

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
      c.Abort()
      return
    }

    // Remove "Bearer " prefix if present
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    }
  }
}
```

如需基於 Session 的身份驗證，請參閱 [Session 管理](/zh-tw/docs/middleware/session-management/)。

### 如何設定請求日誌記錄？

Gin 透過 `gin.Default()` 包含預設的日誌記錄中介軟體。如需在正式環境使用結構化 JSON 日誌記錄，請參閱[結構化日誌記錄](/zh-tw/docs/logging/structured-logging/)。

基本日誌自訂：

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

請參閱[日誌記錄](/zh-tw/docs/logging/)章節了解所有選項，包括自訂格式、檔案輸出和跳過查詢字串。

### 如何處理優雅關閉？

請參閱[優雅地重啟或停止](/zh-tw/docs/server-config/graceful-restart-or-stop/)以獲取包含程式碼範例的完整指南。

### 為什麼我收到「404 Not Found」而不是「405 Method Not Allowed」？

預設情況下，Gin 對不支援所請求 HTTP 方法的路由回傳 404。設定 `HandleMethodNotAllowed = true` 以改為回傳 405：

```go
r := gin.Default()
r.HandleMethodNotAllowed = true

r.GET("/ping", func(c *gin.Context) {
  c.JSON(200, gin.H{"message": "pong"})
})

r.Run()
```

```sh
$ curl -X POST localhost:8080/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
```

### 如何同時綁定查詢參數和 POST 資料？

使用 `ShouldBind()` 會根據內容類型自動選擇綁定方式：

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

請參閱[資料綁定](/zh-tw/docs/binding/)章節了解所有綁定選項。

### 如何驗證請求資料？

Gin 使用 [go-playground/validator](https://github.com/go-playground/validator) 進行驗證。在結構體中新增驗證標籤：

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

請參閱[綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)了解自訂驗證器和進階用法。

### 如何在正式環境模式下執行 Gin？

設定 `GIN_MODE` 環境變數為 `release`：

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

或以程式方式設定：

```go
gin.SetMode(gin.ReleaseMode)
```

Release 模式停用除錯日誌記錄並提升效能。

### 如何在 Gin 中處理資料庫連線？

請參閱[資料庫整合](/zh-tw/docs/server-config/database/)以獲取涵蓋 `database/sql`、GORM、連線池和依賴注入模式的完整指南。

### 如何測試 Gin 處理函式？

使用 `net/http/httptest` 測試你的路由：

```go
func TestPingRoute(t *testing.T) {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

請參閱[測試](/zh-tw/docs/testing/)文件了解更多範例。

## 效能問題

### 如何針對高流量最佳化 Gin？

1. **使用 Release 模式**：設定 `GIN_MODE=release`
2. **停用不必要的中介軟體**：只使用你需要的
3. **使用 `gin.New()` 取代 `gin.Default()`** 以手動控制中介軟體
4. **連線池**：配置資料庫連線池（參見[資料庫整合](/zh-tw/docs/server-config/database/)）
5. **快取**：為頻繁存取的資料實作快取
6. **負載均衡**：使用反向代理（nginx、HAProxy）
7. **分析**：使用 Go 的 pprof 來識別瓶頸
8. **監控**：設定[指標與監控](/zh-tw/docs/server-config/metrics/)來追蹤效能

### Gin 適合用於正式環境嗎？

是的。Gin 被許多企業在正式環境中使用，並在大規模下經過實戰驗證。請參閱[使用者](/zh-tw/docs/users/)了解在正式環境中使用 Gin 的專案範例。

## 疑難排解

### 為什麼我的路由參數不起作用？

確保路由參數使用 `:` 語法並正確提取：

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

請參閱[路徑參數](/zh-tw/docs/routing/param-in-path/)了解細節。

### 為什麼我的中介軟體沒有執行？

中介軟體必須在路由或路由群組之前註冊：

```go
// Correct order
r := gin.New()
r.Use(MyMiddleware()) // Register middleware first
r.GET("/ping", handler) // Then routes

// For route groups
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware for this group
{
  auth.GET("/dashboard", handler)
}
```

請參閱[使用中介軟體](/zh-tw/docs/middleware/using-middleware/)了解細節。

### 為什麼請求綁定失敗？

常見原因：

1. **缺少綁定標籤**：新增 `json:"field"` 或 `form:"field"` 標籤
2. **Content-Type 不匹配**：確保客戶端傳送正確的 Content-Type 標頭
3. **驗證錯誤**：檢查驗證標籤和要求
4. **未匯出的欄位**：只有匯出的（首字母大寫）結構體欄位會被綁定

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

請參閱[綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)了解細節。
