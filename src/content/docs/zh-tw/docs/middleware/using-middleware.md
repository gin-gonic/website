---
title: "使用中介軟體"
sidebar:
  order: 2
---

Gin 中的中介軟體是在路由處理函式之前（以及可選地在之後）執行的函式。它們用於橫切關注點，如日誌記錄、身份驗證、錯誤恢復和請求修改。

Gin 支援三個層級的中介軟體附加：

- **全域中介軟體** — 套用於路由器中的每個路由。使用 `router.Use()` 註冊。適用於日誌記錄和 panic 恢復等通用需求。
- **群組中介軟體** — 套用於路由群組內的所有路由。使用 `group.Use()` 註冊。適用於對路由子集（例如所有 `/admin/*` 路由）套用身份驗證或授權。
- **單一路由中介軟體** — 僅套用於單一路由。作為額外參數傳遞給 `router.GET()`、`router.POST()` 等。適用於路由特定的邏輯，如自訂速率限制或輸入驗證。

**執行順序：** 中介軟體函式按註冊順序執行。當中介軟體呼叫 `c.Next()` 時，它會將控制權傳遞給下一個中介軟體（或最終處理函式），然後在 `c.Next()` 返回後恢復執行。這形成了類似堆疊（LIFO）的模式——第一個註冊的中介軟體最先開始但最後結束。如果中介軟體不呼叫 `c.Next()`，後續的中介軟體和處理函式將被跳過（適合用 `c.Abort()` 短路）。

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` 是一個便捷函式，建立一個已附加 `Logger` 和 `Recovery` 中介軟體的路由器。如果你想要一個不帶任何中介軟體的路由器，請如上所示使用 `gin.New()`，並僅新增你需要的中介軟體。
:::
