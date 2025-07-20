---
title: "快速入門"
sidebar:
  order: 2
---

在這個快速入門中，我們將從程式碼片段中獲得洞察並學習如何：

## 需求

- Go 1.16 及更新版本

## 安裝

安裝 Gin 套件前, 你需要先安裝 Go 和準備好你的工作環境。

1. 下載並安裝

    ```sh
    go get -u github.com/gin-gonic/gin
    ```

2. 在程式碼當中匯入套件

    ```go
    import "github.com/gin-gonic/gin"
    ```

3. （可選的）如果你想要使用像是 `http.StatusOK` 的常數，
   你會需要匯入 `net/http` 套件

    ```go
    import "net/http"
    ```

4. 新增你的專案資料夾並 `cd` 進入

    ```sh
    mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
    ```

5. 複製範本到你的專案

    ```sh
    curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
    ```

6. 執行你的專案

    ```sh
    go run main.go
    ```

## 開始使用

> 不確定如何寫和執行 Go 程式碼？ [查看 Go 文件](https://golang.org/doc/code.html).

第一步，新增一個檔案 `example.go`:

```sh
# assume the following codes in example.go file
touch example.go
```

接下來，將下列程式碼放進 `example.go`:

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
  router.Run() // listen and serve on 0.0.0.0:8080
}
```

然後，你可以透過 `go run example.go` 來執行這個程式碼：

```shell
# run example.go and visit 0.0.0.0:8080/ping on browser
go run example.go
```
