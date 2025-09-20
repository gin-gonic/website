---
title: "文档"
sidebar:
  order: 20
---

Gin 是一个高性能的 [Go](https://go.dev/) HTTP Web 框架。它提供了类似 Martini 的 API，但凭借 [httprouter](https://github.com/julienschmidt/httprouter) 性能提升显著—最高可达 40 倍。Gin 适合开发要求高速度和开发者生产力的 REST API、Web 应用和微服务。

**为什么选择 Gin?**

Gin 结合了 Express.js 式路由的简洁与 Go 的高性能，特别适用于：

- 构建高吞吐量的 REST API
- 开发需要高并发的微服务
- 创建响应速度极快的 Web 应用
- 用极少的样板代码快速原型化 Web 服务

**Gin 的核心特性：**

- **零分配路由器** —— 内存高效，无堆分配
- **高性能** —— 基准测试显示速度显著优于其他 Go web 框架
- **中间件支持** —— 可扩展中间件系统，支持认证、日志、CORS 等
- **防崩溃** —— 内置恢复中间件可防止 panic 引起的服务崩溃
- **JSON 校验** —— 自动绑定和验证 JSON 请求/响应
- **路由分组** —— 组织相关路由并应用公共中间件
- **错误管理** —— 集中处理与日志记录所有错误
- **内置渲染** —— 支持 JSON, XML, HTML 模板等
- **可扩展** —— 社区中拥有大规模中间件和插件生态

## 入门

### 前提条件

- **Go 版本**：Gin 需 [Go](https://go.dev/) [1.23](https://go.dev/doc/devel/release#go1.23.0) 或更高版本
- **Go 基础知识**：了解 Go 语法及包管理有助于使用

### 安装

使用 [Go 模块支持](https://go.dev/wiki/Modules#how-to-use-modules)，直接在代码导入 Gin，Go 在构建时自动下载：

```go
import "github.com/gin-gonic/gin"
```

### 第一个 Gin 应用

如下示例展现了 Gin 的简洁性：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // 创建带默认中间件（日志与恢复）的 Gin 路由器
  r := gin.Default()
  
  // 定义简单的 GET 路由
  r.GET("/ping", func(c *gin.Context) {
    // 返回 JSON 响应
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // 默认端口 8080 启动服务器
  // 监听 0.0.0.0:8080（Windows 下为 localhost:8080）
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
4. 您应看到：`{"message":"pong"}`

**本示例展示：**

- 使用默认中间件创建 Gin 路由器
- 用简单处理函数定义 HTTP 路由
- 返回 JSON 响应
- 启动 HTTP 服务器

### 接下来的学习

首次运行 Gin 应用后，建议进一步学习如下资源：

#### 📚 学习资源

- **[Gin 快速入门指南](./quickstart/)** —— 包含丰富 API 示例和构建配置
- **[示例仓库](https://github.com/gin-gonic/examples)** —— 多种 Gin 场景示例可直接运行：
  - REST API 开发
  - 认证和中间件
  - 文件上传与下载
  - WebSocket 连接
  - 模板渲染

### 官方教程

- [Go.dev 教程：用 Go 和 Gin 开发 RESTful API](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 中间件生态

Gin 拥有丰富的中间件生态，满足各种常见 Web 开发需求。可探索社区贡献中间件：

- **[gin-contrib](https://github.com/gin-contrib)** —— 官方中间件集合，主要包括：
  - 认证（JWT、Basic Auth、Session）
  - CORS、限流、压缩
  - 日志、指标、链路追踪
  - 提供静态文件、模板引擎

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** —— 更多社区中间件
