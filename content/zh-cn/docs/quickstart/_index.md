---
title: "快速入门"
draft: false
weight: 2
---

- [要求](#要求)
- [安装](#安装)
- [开始](#开始)

## 要求

- Go 1.9 及以上版本

> 很快将不再支持Go 1.7或Go 1.8。

## 安装

要安装 Gin 软件包，需要先安装 Go 并设置 Go 工作区。

1.下载并安装 gin：

```sh
$ go get -u github.com/gin-gonic/gin
```

2.将 gin 引入到代码中：

```go
import "github.com/gin-gonic/gin"
```

3.（可选）如果使用诸如 `http.StatusOK` 之类的常量，则需要引入 `net/http` 包：

```go
import "net/http"
```

#### 使用 [Govendor](https://github.com/kardianos/govendor) 工具创建项目

1.`go get` govendor

```sh
$ go get github.com/kardianos/govendor
```
2.创建项目并且 `cd` 到项目目录中

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

3.使用 govendor 初始化项目，并且引入 gin

```sh
$ govendor init
$ govendor fetch github.com/gin-gonic/gin@v1.3
```

4.复制启动文件模板到项目目录中

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

5.启动项目

```sh
$ go run main.go
```

## 开始

> 不确定如何编写和执行 Go 代码? [点击这里](https://golang.org/doc/code.html).

首先，创建一个名为 `example.go` 的文件

```sh
$ touch example.go
```

接下来, 将如下的代码写入 `example.go` 中：

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
	r.Run() // 监听并在 0.0.0.0:8080 上启动服务
}
```

然后, 执行 `go run example.go` 命令来运行代码：

```sh
# 运行 example.go 并且在浏览器中访问 0.0.0.0:8080/ping
$ go run example.go
```
