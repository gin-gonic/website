---
title: "快速入门"
sidebar:
  order: 2
---

欢迎使用 Gin 快速入门！本指南将引导你完成 Gin 的安装、项目设置和运行第一个 API，让你能够自信地开始构建 Web 服务。

## 前置条件

- **Go 版本**：Gin 需要 [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) 或更高版本
- 确认 Go 在你的 `PATH` 中并且可以从终端使用。有关 Go 安装帮助，[请参阅官方文档](https://go.dev/doc/install)。

---

## 第一步：安装 Gin 并初始化项目

首先创建一个新的项目文件夹并初始化 Go 模块：

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

添加 Gin 作为依赖：

```sh
go get -u github.com/gin-gonic/gin
```

---

## 第二步：创建你的第一个 Gin 应用

创建一个名为 `main.go` 的文件：

```sh
touch main.go
```

打开 `main.go` 并添加以下代码：

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // listens on 0.0.0.0:8080 by default
}
```

---

## 第三步：运行你的 API 服务器

使用以下命令启动服务器：

```sh
go run main.go
```

在浏览器中访问 [http://localhost:8080/ping](http://localhost:8080/ping)，你应该会看到：

```json
{"message":"pong"}
```

---

## 附加示例：在 Gin 中使用 net/http

如果你想使用 `net/http` 的响应码常量，也需要将其导入：

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  router.Run()
}
```

---

## 提示与资源

- 刚接触 Go？请在[官方 Go 文档](https://go.dev/doc/code)中学习如何编写和运行 Go 代码。
- 想要动手实践 Gin 的概念？查看我们的[学习资源](../learning-resources)获取交互式挑战和教程。
- 需要一个完整的示例？尝试使用以下命令获取脚手架：

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 如需更详细的文档，请访问 [Gin 源码文档](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)。
