---
title: "Запуск нескольких сервисов"
sidebar:
  order: 4
---

Вы можете запускать несколько серверов Gin в одном процессе — каждый на своём порту — используя `errgroup.Group` из пакета `golang.org/x/sync/errgroup`. Это полезно, когда вам нужно предоставить отдельные API (например, публичное API на порту 8080 и административное API на порту 8081) без развёртывания отдельных бинарных файлов.

Каждый сервер получает свой собственный маршрутизатор, стек middleware и конфигурацию `http.Server`.

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

## Тестирование

```sh
# Server 01 on port 8080
curl http://localhost:8080/
# Output: {"code":200,"message":"Welcome server 01"}

# Server 02 on port 8081
curl http://localhost:8081/
# Output: {"code":200,"message":"Welcome server 02"}
```

:::note
Если один из серверов не может запуститься (например, если порт уже занят), `g.Wait()` возвращает первую ошибку. Оба сервера должны успешно запуститься, чтобы процесс продолжал работу.
:::

## Смотрите также

- [Пользовательская конфигурация HTTP](/ru/docs/server-config/custom-http-config/)
- [Плавный перезапуск или остановка](/ru/docs/server-config/graceful-restart-or-stop/)
