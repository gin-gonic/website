---
title: "快速開始"
sidebar:
  order: 2
---

歡迎來到 Gin 的快速開始指南！本指南將逐步帶你完成 Gin 的安裝、專案初始化以及運行第一個 API，協助你快速上手 Web 服務開發。

## 必備條件

- **Go 版本**：Gin 需要 [Go](https://go.dev/) 版本 [1.24](https://go.dev/doc/devel/release#go1.24) 或更高
- 請確認 Go 已加入你的 `PATH`，並可在終端機中使用。如需安裝協助，請參考[官方文件](https://golang.org/doc/install)。

---

## 第一步：安裝 Gin 並初始化專案

先建立專案資料夾並初始化 Go 模組：

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

安裝 Gin 套件：

```sh
go get -u github.com/gin-gonic/gin
```

---

## 第二步：建立你的第一個 Gin 應用程式

創建 `main.go` 檔案：

```sh
touch main.go
```

打開 `main.go` 並貼上以下程式碼：

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
  router.Run() // 預設監聽 0.0.0.0:8080
}
```

---

## 第三步：啟動 API 服務

用下列指令啟動服務：

```sh
go run main.go
```

於瀏覽器開啟 [http://localhost:8080/ping](http://localhost:8080/ping) 即可看到：

```json
{"message":"pong"}
```

---

## 補充範例：Gin 搭配 net/http 使用

若需使用 `net/http` 套件常數設定回應碼，請一起引入：

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

## 小技巧與資源

- 新手入門 Go？請參考[這裡](https://golang.org/doc/code.html)學習 Go 寫作與執行方式。
- 想要實際練習 Gin 概念？請查看我們的[學習資源](../learning-resources)以獲取互動式挑戰和教學。
- 想要更完整範例？請執行：

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 更多詳細說明可參閱 [Gin 官方文件](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)。
