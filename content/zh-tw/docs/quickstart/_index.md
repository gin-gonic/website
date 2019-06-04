---
title: "快速入門"
draft: false
weight: 2
---

- [需求](#需求)
- [安裝](#安裝)
- [開始使用](#開始使用)

## 需求

- Go 1.6 及更新版本

> Go 1.7 和 Go 1.8 即將不再支援

## 安裝

安裝 Gin 套件前, 你需要先安裝 Go 和準備好你的工作環境。

1. 下載並安裝

```sh
$ go get -u github.com/gin-gonic/gin
```

2. 在程式碼當中匯入套件

```go
import "github.com/gin-gonic/gin"
```

3. （可選的）如果你想要使用像是 `http.StatusOK` 的常數，你會需要匯入 `net/http` 套件
  
```go
import "net/http"
```

### 使用 vendor 工具像是 [Govendor](https://github.com/kardianos/govendor)

1. `go get` govendor

```sh
$ go get github.com/kardianos/govendor
```

2. 新增你的專案資料夾並 `cd` 進入

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
   ```

3. Vendor init 專案並加入 gin

```sh
$ govendor init
$ govendor fetch github.com/gin-gonic/gin@v1.3
```

4. 複製範本到你的專案

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

5. 執行你的專案

```sh
$ go run main.go
```

## 開始使用

> 不確定如何寫和執行 Go 程式碼？ [Click here](https://golang.org/doc/code.html).

第一步，新增一個檔案 `example.go`:

```sh
# assume the following codes in example.go file
$ touch example.go
```

接下來，將下列程式碼放進 `example.go`:

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
    r.Run() // listen and serve on 0.0.0.0:8080
}
```

然後，你可以透過 `go run example.go` 來執行這個程式碼：

```shell
# run example.go and visit 0.0.0.0:8080/ping on browser
$ go run example.go
```
