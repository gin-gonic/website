---
title: "Плавная перезагрузка или остановка"
sidebar:
  order: 5
---

Когда процесс сервера получает сигнал завершения (например, во время развёртывания или масштабирования), немедленное завершение прерывает все текущие запросы, оставляя клиентов с разорванными соединениями и потенциально повреждёнными операциями. **Плавное завершение** решает эту проблему:

- **Завершение текущих запросов** -- Запросам, которые уже обрабатываются, даётся время на завершение, и клиенты получают корректные ответы вместо сброса соединений.
- **Опустошение соединений** -- Сервер прекращает принимать новые соединения, в то время как существующие могут завершиться, предотвращая резкое отключение.
- **Очистка ресурсов** -- Открытые подключения к базам данных, файловые дескрипторы и фоновые воркеры закрываются корректно, предотвращая повреждение данных или утечку ресурсов.
- **Развёртывание без простоя** -- В сочетании с балансировщиком нагрузки плавное завершение позволяет развёртывать новые версии без видимых для пользователя ошибок.

Есть несколько способов достичь этого в Go.

Мы можем использовать [fvbock/endless](https://github.com/fvbock/endless) для замены стандартного `ListenAndServe`. Подробнее см. issue [#296](https://github.com/gin-gonic/gin/issues/296).

```go
router := gin.Default()
router.GET("/", handler)
// [...]
endless.ListenAndServe(":4242", router)
```

Альтернативы endless:

* [manners](https://github.com/braintree/manners): Вежливый HTTP-сервер на Go с плавным завершением.
* [graceful](https://github.com/tylerb/graceful): Go-пакет для плавного завершения http.Handler сервера.
* [grace](https://github.com/facebookgo/grace): Плавный перезапуск и развёртывание без простоя для серверов на Go.

Если вы используете Go 1.8 и выше, вам может не понадобиться эта библиотека! Рассмотрите использование встроенного метода [Shutdown()](https://golang.org/pkg/net/http/#Server.Shutdown) у `http.Server` для плавного завершения. См. полный пример [graceful-shutdown](https://github.com/gin-gonic/examples/tree/master/graceful-shutdown) с gin.

```go
//go:build go1.8
// +build go1.8

package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "Welcome Gin Server")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: router.Handler(),
  }

  go func() {
    // service connections
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()

  // Wait for interrupt signal to gracefully shutdown the server with
  // a timeout of 5 seconds.
  quit := make(chan os.Signal, 1)
  // kill (no params) by default sends syscall.SIGTERM
  // kill -2 is syscall.SIGINT
  // kill -9 is syscall.SIGKILL but can't be caught, so don't need add it
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutdown Server ...")

  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  if err := srv.Shutdown(ctx); err != nil {
    log.Println("Server Shutdown:", err)
  }
  log.Println("Server exiting")
}
```
