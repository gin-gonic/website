---
title: "路由"
sidebar:
  order: 3
---

Gin 提供了建構於 [httprouter](https://github.com/julienschmidt/httprouter) 之上的強大路由系統，實現高效能的 URL 匹配。在底層，httprouter 使用 [Radix 樹](https://en.wikipedia.org/wiki/Radix_tree)（也稱為壓縮前綴樹）來儲存和查詢路由，這意味著路由匹配速度極快，且每次查詢不需要任何記憶體配置。這使得 Gin 成為最快速的 Go Web 框架之一。

路由透過在引擎（或路由群組）上呼叫 HTTP 方法來註冊，並提供 URL 模式以及一個或多個處理函式：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## 本節內容

以下頁面詳細介紹了各個路由主題：

- [**使用 HTTP 方法**](./http-method/) -- 為 GET、POST、PUT、DELETE、PATCH、HEAD 和 OPTIONS 註冊路由。
- [**路徑參數**](./param-in-path/) -- 從 URL 路徑中擷取動態片段（例如 `/user/:name`）。
- [**查詢字串參數**](./querystring-param/) -- 從請求 URL 中讀取查詢字串值。
- [**查詢與 POST 表單**](./query-and-post-form/) -- 在同一個處理函式中存取查詢字串和 POST 表單資料。
- [**Map 作為查詢字串或 POST 表單**](./map-as-querystring-or-postform/) -- 從查詢字串或 POST 表單中綁定 map 參數。
- [**Multipart/urlencoded 表單**](./multipart-urlencoded-form/) -- 解析 `multipart/form-data` 和 `application/x-www-form-urlencoded` 請求主體。
- [**檔案上傳**](./upload-file/) -- 處理單一和多個檔案上傳。
- [**路由分組**](./grouping-routes/) -- 在共用前綴下組織路由並共享中介軟體。
- [**重新導向**](./redirects/) -- 執行 HTTP 和路由層級的重新導向。
