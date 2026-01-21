---
title: "🍳 Gin 食谱（烹饪书）"
sidebar:
  order: 6
---

## 介绍

本节通过小型实用的食谱展示 **如何在代码中使用 Gin**。
每个食谱都专注于 **单一概念**，以便您可以快速学习并立即应用。

使用这些示例作为参考，使用 Gin 构建真实世界的 API。

---

## 🧭 您将学到什么

在本节中，您将找到涵盖以下内容的示例：

- **服务器基础**：运行服务器、路由和配置。
- **请求处理**：绑定 JSON、XML 和表单数据。
- **中间件**：使用内置和自定义中间件。
- **渲染**：提供 HTML、JSON、XML 等。
- **安全性**：处理 SSL、标头和身份验证。

---

## 🥇 食谱 1：最小 Gin 服务器

**目标：** 启动 Gin 服务器并处理基本请求。

### 步骤

1. 创建路由器
2. 定义路由
3. 启动服务器

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
