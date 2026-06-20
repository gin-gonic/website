---
title: "執行多個服務"
sidebar:
  order: 4
---

你可以在同一個程序中執行多個 Gin 伺服器——每個在不同的連接埠——透過使用 `golang.org/x/sync/errgroup` 套件的 `errgroup.Group`。當你需要公開不同的 API（例如公開 API 在連接埠 8080，管理 API 在連接埠 8081）而不需要部署不同的二進位檔時，這非常有用。

每個伺服器都有自己的路由器、中介軟體堆疊和 `http.Server` 配置。

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "golang.org/x/sync/errgroup"
)

var (
  g errgroup.Group
)

func router01() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 01",
    })
  })

  return e
}

func router02() http.Handler {
  e := gin.New()
  e.Use(gin.Recovery())
  e.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "code":    http.StatusOK,
      "message": "Welcome server 02",
    })
  })

  return e
}

func main() {
  server01 := &http.Server{
    Addr:         ":8080",
    Handler:      router01(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  server02 := &http.Server{
    Addr:         ":8081",
    Handler:      router02(),
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
  }

  g.Go(func() error {
    return server01.ListenAndServe()
  })

  g.Go(func() error {
    return server02.ListenAndServe()
  })

  if err := g.Wait(); err != nil {
    log.Fatal(err)
  }
}
```

## 測試

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
如果其中一個伺服器啟動失敗（例如連接埠已被佔用），`g.Wait()` 會回傳第一個錯誤。兩個伺服器必須都成功啟動，程序才能持續執行。
:::

## 另請參閱

- [自訂 HTTP 配置](/zh-tw/docs/server-config/custom-http-config/)
- [優雅重啟或停止](/zh-tw/docs/server-config/graceful-restart-or-stop/)
