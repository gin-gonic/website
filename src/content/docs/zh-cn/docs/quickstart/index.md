---
title: "快速入门"
sidebar:
  order: 2
---

欢迎来到 Gin 的快速入门！本指南将带你一步步完成 Gin 的安装、项目初始化以及运行你的第一个 API，助你轻松开始 Web 服务开发。

## 前提条件

- **Go：** 需安装 1.23 或更高版本。
- 请确保 Go 已加入你的 `PATH` 并可在终端中使用。如需安装帮助请参阅[官方文档](https://golang.org/doc/install)。

---

## 第一步：安装 Gin 并初始化项目

先创建项目文件夹并初始化 Go 模块：

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

安装 Gin 依赖：

```sh
go get -u github.com/gin-gonic/gin
```

---

## 第二步：编写你的第一个 Gin 应用

创建 `main.go` 文件：

```sh
touch main.go
```

打开 `main.go`，输入以下代码：

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
  router.Run() // 默认监听 0.0.0.0:8080
}
```

---

## 第三步：运行你的 API 服务

用如下命令启动服务：

```sh
go run main.go
```

在浏览器中访问 [http://localhost:8080/ping](http://localhost:8080/ping) ，你会看到：

```json
{"message":"pong"}
```

---

## 补充示例：Gin结合 net/http 使用

如果需要用 `net/http` 包中的常量表示响应码，请同时导入它：

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

## 小贴士与资源

- 第一次接触 Go？参考[这里](https://golang.org/doc/code.html)学习 Go 的编码和运行方法。
- 想要更完整的示例？请执行：

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 更多详细文档请访问 [Gin 官方文档](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)。
