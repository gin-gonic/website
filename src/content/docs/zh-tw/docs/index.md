---
title: "文件"
sidebar:
  order: 20
---

Gin 是一個用 [Go](https://go.dev/) 撰寫的高效能 HTTP Web 框架。它提供類似 Martini 的 API，但效能顯著提升——得益於 [httprouter](https://github.com/julienschmidt/httprouter)，速度快上 40 倍。Gin 專為建構 REST API、Web 應用程式和微服務而設計，兼顧速度與開發者生產力。

**為什麼選擇 Gin？**

Gin 結合了 Express.js 風格路由的簡潔性與 Go 的效能特性，非常適合：

- 建構高吞吐量的 REST API
- 開發需要處理大量並發請求的微服務
- 建立需要快速回應時間的 Web 應用程式
- 以最少的樣板程式碼快速開發 Web 服務原型

**Gin 的主要特點：**

- **零記憶體配置路由器** - 極高記憶體效率的路由，不產生堆積記憶體配置
- **高效能** - 基準測試顯示其速度優於其他 Go Web 框架
- **中介軟體支援** - 可擴充的中介軟體系統，支援身份驗證、日誌記錄、CORS 等
- **不會當機** - 內建恢復中介軟體，防止 panic 導致伺服器崩潰
- **JSON 驗證** - 自動請求/回應 JSON 綁定與驗證
- **路由分組** - 組織相關路由並套用共用中介軟體
- **錯誤管理** - 集中式錯誤處理與日誌記錄
- **內建渲染** - 支援 JSON、XML、HTML 模板等多種格式
- **可擴充** - 龐大的社群中介軟體與外掛生態系統

## 開始使用

### 先決條件

- **Go 版本**：Gin 需要 [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) 或以上版本
- **基礎 Go 知識**：熟悉 Go 語法和套件管理會有所幫助

### 安裝

透過 [Go 的模組支援](https://go.dev/wiki/Modules#how-to-use-modules)，只需在程式碼中匯入 Gin，Go 將在建構時自動下載：

```go
import "github.com/gin-gonic/gin"
```

### 你的第一個 Gin 應用程式

以下是一個展示 Gin 簡潔性的完整範例：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a Gin router with default middleware (logger and recovery)
  r := gin.Default()

  // Define a simple GET endpoint
  r.GET("/ping", func(c *gin.Context) {
    // Return JSON response
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // Start server on port 8080 (default)
  // Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
  r.Run()
}
```

**執行應用程式：**

1. 將上述程式碼儲存為 `main.go`
2. 執行應用程式：

   ```sh
   go run main.go
   ```

3. 開啟瀏覽器並造訪 [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. 你應該會看到：`{"message":"pong"}`

**此範例展示了：**

- 使用預設中介軟體建立 Gin 路由器
- 使用簡單的處理函式定義 HTTP 端點
- 回傳 JSON 回應
- 啟動 HTTP 伺服器

### 下一步

在執行完你的第一個 Gin 應用程式後，可以探索以下資源來深入學習：

#### 學習資源

- **[Gin 快速入門指南](./quickstart/)** - 包含 API 範例和建構配置的完整教學
- **[範例儲存庫](https://github.com/gin-gonic/examples)** - 展示各種 Gin 使用情境的即用範例：
  - REST API 開發
  - 身份驗證與中介軟體
  - 檔案上傳與下載
  - WebSocket 連線
  - 模板渲染

### 官方教學

- [Go.dev 教學：使用 Go 和 Gin 開發 RESTful API](https://go.dev/doc/tutorial/web-service-gin)

## 中介軟體生態系統

Gin 擁有豐富的中介軟體生態系統，滿足常見的 Web 開發需求。探索社群貢獻的中介軟體：

- **[gin-contrib](https://github.com/gin-contrib)** - 官方中介軟體集合，包括：
  - 身份驗證（JWT、Basic Auth、Sessions）
  - CORS、速率限制、壓縮
  - 日誌記錄、指標監控、鏈路追蹤
  - 靜態檔案服務、模板引擎

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - 額外的社群中介軟體
