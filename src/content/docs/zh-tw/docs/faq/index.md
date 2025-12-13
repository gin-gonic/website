---
title: "常見問題"
sidebar:
  order: 9
---

## 一般問題

### 如何在開發時啟用即時重載？

使用 [Air](https://github.com/cosmtrek/air) 在開發時自動即時重載。Air 會監控你的檔案，並在偵測到變更時自動重新建置/重啟你的應用程式。

**安裝：**

```sh
# 全域安裝 Air
go install github.com/cosmtrek/air@latest
```

**設定：**

在專案根目錄建立 `.air.toml` 設定檔：

```sh
air init
```

這會產生一個預設設定。你可以根據你的 Gin 專案自訂：

```toml
# .air.toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

**使用：**

在專案目錄中執行 `air` 取代 `go run`：

```sh
air
```

Air 現在會監控你的 `.go` 檔案，並在變更時自動重新建置/重啟你的 Gin 應用程式。

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

  // 預設 CORS 設定
  r.Use(cors.Default())

  // 或自訂 CORS 設定
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

### 如何提供靜態檔案？

使用 `Static()` 或 `StaticFS()` 來提供靜態檔案：

```go
func main() {
  r := gin.Default()

  // 在 /assets/* 路徑提供 ./assets 目錄的檔案
  r.Static("/assets", "./assets")

  // 提供單一檔案
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // 從嵌入式檔案系統提供（Go 1.16+）
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

詳細資訊請參閱[提供靜態檔案範例](../examples/serving-static-files/)。

### 如何處理檔案上傳？

使用 `FormFile()` 處理單一檔案，或使用 `MultipartForm()` 處理多個檔案：

```go
// 單一檔案上傳
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // 儲存檔案
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "檔案 %s 上傳成功", file.Filename)
})

// 多檔案上傳
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "已上傳 %d 個檔案", len(files))
})
```

詳細資訊請參閱[上傳檔案範例](../examples/upload-file/)。

### 如何使用 JWT 實作身份驗證？

使用 [gin-contrib/jwt](https://github.com/gin-contrib/jwt) 或實作自訂中介軟體：

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

func GenerateToken(username string) (string, error) {
  claims := Claims{
    Username: username,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "缺少授權 token"})
      c.Abort()
      return
    }

    // 移除 "Bearer " 前綴（如果存在）
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "無效的 token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "無效的 token claims"})
      c.Abort()
    }
  }
}

func main() {
  r := gin.Default()

  r.POST("/login", func(c *gin.Context) {
    var credentials struct {
      Username string `json:"username"`
      Password string `json:"password"`
    }

    if err := c.BindJSON(&credentials); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    // 驗證憑證（實作你自己的邏輯）
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "無效的憑證"})
    }
  })

  // 受保護的路由
  authorized := r.Group("/")
  authorized.Use(AuthMiddleware())
  {
    authorized.GET("/profile", func(c *gin.Context) {
      username := c.MustGet("username").(string)
      c.JSON(http.StatusOK, gin.H{"username": username})
    })
  }

  r.Run()
}
```

### 如何設定請求日誌記錄？

Gin 包含預設的日誌記錄中介軟體。自訂它或使用結構化日誌記錄：

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// 自訂日誌記錄中介軟體
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path

    c.Next()

    latency := time.Since(start)
    statusCode := c.Writer.Status()
    clientIP := c.ClientIP()
    method := c.Request.Method

    log.Printf("[GIN] %s | %3d | %13v | %15s | %-7s %s",
      time.Now().Format("2006/01/02 - 15:04:05"),
      statusCode,
      latency,
      clientIP,
      method,
      path,
    )
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

更進階的日誌記錄，請參閱[自訂日誌格式範例](../examples/custom-log-format/)。

### 如何處理優雅關閉？

實作優雅關閉以正確關閉連線：

```go
package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "歡迎！")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // 在 goroutine 中執行伺服器
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("監聽: %s\n", err)
    }
  }()

  // 等待中斷信號以優雅地關閉伺服器
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("正在關閉伺服器...")

  // 給未完成的請求 5 秒鐘完成
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("伺服器強制關閉:", err)
  }

  log.Println("伺服器結束")
}
```

詳細資訊請參閱[優雅重啟或停止範例](../examples/graceful-restart-or-stop/)。

### 為什麼我得到「404 Not Found」而不是「405 Method Not Allowed」？

預設情況下，Gin 會對不支援請求的 HTTP 方法的路由回傳 404。要回傳 405 Method Not Allowed，請啟用 `HandleMethodNotAllowed` 選項。

詳細資訊請參閱 [Method Not Allowed 常見問題](./method-not-allowed/)。

### 如何同時綁定查詢參數和 POST 資料？

使用 `ShouldBind()`，它會根據內容類型自動選擇綁定方式：

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // 綁定查詢參數和請求本體（JSON/表單）
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

更多控制，請參閱[綁定查詢或 POST 範例](../examples/bind-query-or-post/)。

### 如何驗證請求資料？

Gin 使用 [go-playground/validator](https://github.com/go-playground/validator) 進行驗證。在你的結構體中加入驗證標籤：

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
  c.JSON(200, gin.H{"message": "使用者有效"})
})
```

自訂驗證器請參閱[自訂驗證器範例](../examples/custom-validators/)。

### 如何在生產模式執行 Gin？

將 `GIN_MODE` 環境變數設定為 `release`：

```sh
export GIN_MODE=release
# 或
GIN_MODE=release ./your-app
```

或以程式方式設定：

```go
gin.SetMode(gin.ReleaseMode)
```

發布模式：

- 停用除錯日誌
- 提升效能
- 稍微減少二進位檔大小

### 如何在 Gin 中處理資料庫連線？

使用依賴注入或上下文來共享資料庫連線：

```go
package main

import (
  "database/sql"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // 方法 1：將 db 傳遞給處理器
  r.GET("/users", func(c *gin.Context) {
    var users []string
    rows, _ := db.Query("SELECT name FROM users")
    defer rows.Close()

    for rows.Next() {
      var name string
      rows.Scan(&name)
      users = append(users, name)
    }

    c.JSON(200, users)
  })

  // 方法 2：使用中介軟體注入 db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

ORM 請考慮搭配 Gin 使用 [GORM](https://gorm.io/)。

### 如何測試 Gin 處理器？

使用 `net/http/httptest` 測試你的路由：

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "testing"

  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
)

func SetupRouter() *gin.Engine {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })
  return r
}

func TestPingRoute(t *testing.T) {
  router := SetupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

更多範例請參閱[測試文件](../testing/)。

## 效能問題

### 如何針對高流量優化 Gin？

1. **使用發布模式**：設定 `GIN_MODE=release`
2. **停用不必要的中介軟體**：只使用你需要的
3. **使用 `gin.New()` 取代 `gin.Default()`**，如果你想要手動控制中介軟體
4. **連線池**：正確設定資料庫連線池
5. **快取**：對常存取的資料實作快取
6. **負載平衡**：使用反向代理（nginx、HAProxy）
7. **效能分析**：使用 Go 的 pprof 找出瓶頸

```go
r := gin.New()
r.Use(gin.Recovery()) // 只使用 recovery 中介軟體

// 設定連線池限制
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Gin 可以用於生產環境嗎？

是的！Gin 被許多公司在生產環境中使用，並經過大規模實戰測試。它是最受歡迎的 Go Web 框架之一，具有：

- 積極維護和社群
- 廣泛的中介軟體生態系統
- 出色的效能基準測試
- 強大的向後相容性

## 疑難排解

### 為什麼我的路由參數不起作用？

確保路由參數使用 `:` 語法並正確提取：

```go
// 正確
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "使用者 ID: %s", id)
})

// 錯誤：/user/{id} 或 /user/<id>
```

### 為什麼我的中介軟體沒有執行？

中介軟體必須在路由或路由群組之前註冊：

```go
// 正確順序
r := gin.New()
r.Use(MyMiddleware()) // 先註冊中介軟體
r.GET("/ping", handler) // 然後是路由

// 對於路由群組
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // 此群組的中介軟體
{
  auth.GET("/dashboard", handler)
}
```

### 為什麼請求綁定失敗？

常見原因：

1. **缺少綁定標籤**：加入 `json:"field"` 或 `form:"field"` 標籤
2. **Content-Type 不符**：確保客戶端發送正確的 Content-Type 標頭
3. **驗證錯誤**：檢查驗證標籤和要求
4. **未匯出欄位**：只有匯出的（大寫開頭）結構體欄位會被綁定

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ 正確
  Email string `json:"email"`                    // ✓ 正確
  age   int    `json:"age"`                      // ✗ 不會綁定（未匯出）
}
```
