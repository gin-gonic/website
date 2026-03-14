---
title: "快速入門"
sidebar:
  order: 2
---

歡迎閱讀 Gin 快速入門指南！本指南將引導你安裝 Gin、設定專案，並執行你的第一個 API——讓你能夠自信地開始建構 Web 服務。

## 先決條件

- **Go 版本**：Gin 需要 [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) 或以上版本
- 確認 Go 已加入你的 `PATH` 環境變數，且可在終端機中使用。如需 Go 安裝說明，[請參閱官方文件](https://go.dev/doc/install)。

---

## 步驟 1：安裝 Gin 並初始化專案

首先建立一個新的專案資料夾並初始化 Go 模組：

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

新增 Gin 作為依賴套件：

```sh
go get -u github.com/gin-gonic/gin
```

---

## 步驟 2：建立你的第一個 Gin 應用程式

建立一個名為 `main.go` 的檔案：

```sh
touch main.go
```

開啟 `main.go` 並加入以下程式碼：

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

## 步驟 3：執行你的 API 伺服器

使用以下指令啟動伺服器：

```sh
go run main.go
```

在瀏覽器中造訪 [http://localhost:8080/ping](http://localhost:8080/ping)，你應該會看到：

```json
{"message":"pong"}
```

---

## 補充範例：在 Gin 中使用 net/http

如果你想使用 `net/http` 的回應碼常數，也需要一併匯入：

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

## 提示與資源

- 剛接觸 Go？請在[官方 Go 文件](https://go.dev/doc/code)中學習如何撰寫和執行 Go 程式碼。
- 想要實際練習 Gin 的概念？查看我們的[學習資源](../learning-resources)，獲取互動式挑戰和教學。
- 需要完整功能的範例？試試用以下指令快速建立：

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 如需更詳細的文件，請造訪 [Gin 原始碼文件](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)。
