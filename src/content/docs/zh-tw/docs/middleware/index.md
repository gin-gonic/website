---
title: "中介軟體"
sidebar:
  order: 6
---

Gin 中的中介軟體提供了一種在 HTTP 請求到達路由處理函式之前進行處理的方式。中介軟體函式與路由處理函式具有相同的簽名——`gin.HandlerFunc`——通常會呼叫 `c.Next()` 將控制權傳遞給鏈中的下一個處理函式。

## 中介軟體的運作方式

Gin 使用**洋蔥模型**來執行中介軟體。每個中介軟體在兩個階段中執行：

1. **前置處理** -- `c.Next()` 之前的程式碼在路由處理函式之前執行。
2. **後置處理** -- `c.Next()` 之後的程式碼在路由處理函式返回後執行。

這意味著中介軟體像洋蔥的層一樣包裹著處理函式。第一個附加的中介軟體是最外層。

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## 附加中介軟體

在 Gin 中有三種方式附加中介軟體：

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

範圍較廣的中介軟體會先執行。在上面的範例中，對 `GET /v1/users` 的請求會依序執行 `Logger`、`Recovery`、`AuthRequired`，然後是 `listUsers`。

## 本節內容

- [**使用中介軟體**](./using-middleware/) -- 全域、群組或個別路由附加中介軟體
- [**自訂中介軟體**](./custom-middleware/) -- 撰寫自訂中介軟體函式
- [**使用 BasicAuth 中介軟體**](./using-basicauth/) -- HTTP 基本身份驗證
- [**在中介軟體中使用 Goroutine**](./goroutines-inside-middleware/) -- 安全地從中介軟體執行背景任務
- [**自訂 HTTP 配置**](./custom-http-config/) -- 中介軟體中的錯誤處理和恢復
- [**安全標頭**](./security-headers/) -- 設定常見的安全標頭
