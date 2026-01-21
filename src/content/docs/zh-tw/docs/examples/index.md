---
title: "🍳 Gin 食譜（烹飪書）"
sidebar:
  order: 6
---

## 介紹

本節透過小型實用的食譜展示 **如何在程式碼中使用 Gin**。
每個食譜都專注於 **單一概念**，以便您可以快速學習並立即應用。

使用這些範例作為參考，使用 Gin 建構真實世界的 API。

---

## 🧭 您將學到什麼

在本節中，您將找到涵蓋以下內容的範例：

- **伺服器基礎**：執行伺服器、路由和設定。
- **請求處理**：綁定 JSON、XML 和表單資料。
- **中介軟體**：使用內建和自訂中介軟體。
- **渲染**：提供 HTML、JSON、XML 等。
- **安全性**：處理 SSL、標頭和身份驗證。

---

## 🥇 食譜 1：最小 Gin 伺服器

**目標：** 啟動 Gin 伺服器並處理基本請求。

### 步驟

1. 建立路由器
2. 定義路由
3. 啟動伺服器

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run(":8080") // http://localhost:8080
}
```
