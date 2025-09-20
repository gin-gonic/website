---
title: "文件"
sidebar:
  order: 20
---

Gin 是一個以 [Go](https://go.dev/) 撰寫的高效能 HTTP Web 框架。它提供類似 Martini 的 API，但透過 [httprouter](https://github.com/julienschmidt/httprouter)，效能提升至 40 倍之多。Gin 適用於 REST API、網頁應用程式與微服務開發，尤其強調速度及開發者生產力。

**為何選擇 Gin?**

Gin 結合 Express.js 式路由的簡潔體驗與 Go 的效能特性，特別適合：

- 建立高流量 REST API
- 開發需要高併發處理的微服務
- 創建反應速度極快的網頁應用程式
- 使用極少樣板快速原型化網頁服務

**Gin 核心特色：**

- **零記憶體分配路由器** —— 超高記憶體效率，無 Heap 配置
- **高效能** —— 基準測試顯示超越其他 Go Web 框架
- **中介軟體 (Middleware) 支援** —— 可擴充的中介軟體系統，適用認證、記錄、CORS 等
- **防崩潰** —— 內建復原中介軟體自動攔截 panic，防止伺服器當掉
- **JSON 驗證** —— 請求/回應自動綁定及驗證
- **路由分組** —— 有效組織路由並可套用通用中介軟體
- **錯誤管理** —— 集中處理與日誌記錄各類錯誤
- **內建渲染** —— 支援 JSON、XML、HTML 樣板等
- **具高度擴充性** —— 社群資源豐富，眾多中介軟體與外掛可用

## 入門指南

### 先決條件

- **Go 版本：** Gin 需要 [Go](https://go.dev/) [1.23](https://go.dev/doc/devel/release#go1.23.0) 或以上版本
- **Go 基礎知識：** 熟悉 Go 語法及套件管理更易上手

### 安裝方式

使用 [Go 模組](https://go.dev/wiki/Modules#how-to-use-modules)功能，只要直接 import Gin，編譯時 Go 會自動下載：

```go
import "github.com/gin-gonic/gin"
```

### 第一個 Gin 應用

以下完整範例展示 Gin 的簡單易用性：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // 建立預設中介軟體 (logger, recovery) 的 Gin 路由器
  r := gin.Default()
  
  // 定義基本 GET 路由
  r.GET("/ping", func(c *gin.Context) {
    // 回傳 JSON 響應
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // 預設 8080 port 啟動伺服器
  // 在 0.0.0.0:8080 (Windows 為 localhost:8080) 監聽
  r.Run()
}
```

**執行應用程式：**

1. 將上方程式碼儲存為 `main.go`
2. 執行應用：

   ```sh
   go run main.go
   ```

3. 在瀏覽器開啟 [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. 畫面顯示： `{"message":"pong"}`

**本範例展示：**

- 建立具預設中介軟體的 Gin 路由器
- 以簡易處理函式定義 HTTP 路由
- 回傳 JSON 響應
- 啟動 HTTP 伺服器

### 進階學習

執行第一個 Gin 應用後，推薦以下資源探索更多：

#### 📚 學習資源

- **[Gin 快速入門指南](./quickstart/)** —— 各式 API 示範與構建設定範例
- **[範例專案](https://github.com/gin-gonic/examples)** —— 多元 Gin 使用場景，提供即用範例：
  - REST API 開發
  - 認證及中介軟體
  - 檔案上傳/下載
  - WebSocket 連線
  - 樣板渲染

### 官方教學

- [Go.dev 教學：使用 Go 與 Gin 開發 RESTful API](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 中介軟體生態系

Gin 有豐富的中介軟體生態系，滿足各類常見 Web 開發需求。可探索社群貢獻的中介軟體：

- **[gin-contrib](https://github.com/gin-contrib)** —— 官方中介軟體集，主要包含：
  - 認證（JWT、Basic Auth、Session）
  - CORS、速度限制、壓縮
  - 日誌、指標、鏈路追蹤
  - 靜態檔案、樣板引擎

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** —— 更多社群中介軟體
