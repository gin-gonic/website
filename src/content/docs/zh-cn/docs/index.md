---
title: "文档"
sidebar:
  order: 20
---

Gin 是一个用 [Go](https://go.dev/) 编写的高性能 HTTP Web 框架。它提供了类似 Martini 的 API，但性能要好得多——得益于 [httprouter](https://github.com/julienschmidt/httprouter)，速度快了多达 40 倍。Gin 专为构建 REST API、Web 应用和微服务而设计，适用于对速度和开发效率有要求的场景。

**为什么选择 Gin？**

Gin 将 Express.js 风格路由的简洁性与 Go 的性能特性相结合，非常适合：

- 构建高吞吐量的 REST API
- 开发需要处理大量并发请求的微服务
- 创建需要快速响应的 Web 应用
- 以最少的样板代码快速构建 Web 服务原型

**Gin 的主要特性：**

- **零分配路由** - 极高的内存效率路由，无堆内存分配
- **高性能** - 基准测试显示其速度优于其他 Go Web 框架
- **中间件支持** - 可扩展的中间件系统，支持认证、日志记录、CORS 等
- **不会崩溃** - 内置恢复中间件可防止 panic 导致服务器崩溃
- **JSON 验证** - 自动请求/响应 JSON 绑定和验证
- **路由分组** - 组织相关路由并应用公共中间件
- **错误管理** - 集中式错误处理和日志记录
- **内置渲染** - 支持 JSON、XML、HTML 模板等
- **可扩展** - 拥有大量社区中间件和插件的生态系统

## 快速入门

### 前置条件

- **Go 版本**：Gin 需要 [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) 或更高版本
- **基础 Go 知识**：熟悉 Go 语法和包管理会有所帮助

### 安装

借助 [Go 的模块支持](https://go.dev/wiki/Modules#how-to-use-modules)，只需在代码中导入 Gin，Go 会在构建时自动获取它：

```go
import "github.com/gin-gonic/gin"
```

### 你的第一个 Gin 应用

以下是一个展示 Gin 简洁性的完整示例：

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

**运行应用：**

1. 将上述代码保存为 `main.go`
2. 运行应用：

   ```sh
   go run main.go
   ```

3. 打开浏览器访问 [`http://localhost:8080/ping`](http://localhost:8080/ping)
4. 你应该会看到：`{"message":"pong"}`

**此示例展示了：**

- 使用默认中间件创建 Gin 路由器
- 使用简单的处理函数定义 HTTP 端点
- 返回 JSON 响应
- 启动 HTTP 服务器

### 下一步

运行完第一个 Gin 应用后，可以探索以下资源了解更多内容：

#### 学习资源

- **[Gin 快速入门指南](./quickstart/)** - 包含 API 示例和构建配置的综合教程
- **[示例仓库](https://github.com/gin-gonic/examples)** - 可直接运行的示例，展示 Gin 的各种用法：
  - REST API 开发
  - 认证与中间件
  - 文件上传和下载
  - WebSocket 连接
  - 模板渲染

### 官方教程

- [Go.dev 教程：使用 Go 和 Gin 开发 RESTful API](https://go.dev/doc/tutorial/web-service-gin)

## 中间件生态系统

Gin 拥有丰富的中间件生态系统，满足常见的 Web 开发需求。探索社区贡献的中间件：

- **[gin-contrib](https://github.com/gin-contrib)** - 官方中间件合集，包括：
  - 认证（JWT、Basic Auth、Sessions）
  - CORS、限流、压缩
  - 日志记录、指标监控、链路追踪
  - 静态文件服务、模板引擎

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - 其他社区中间件
