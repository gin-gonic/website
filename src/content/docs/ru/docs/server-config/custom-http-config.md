---
title: "Пользовательская конфигурация HTTP"
sidebar:
  order: 1
---

По умолчанию `router.Run()` запускает базовый HTTP-сервер. Для продакшена вам может потребоваться настроить таймауты, лимиты заголовков или параметры TLS. Вы можете сделать это, создав собственный `http.Server` и передав маршрутизатор Gin в качестве `Handler`.

## Базовое использование

Передайте маршрутизатор Gin непосредственно в `http.ListenAndServe`:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## С пользовательскими настройками сервера

Создайте структуру `http.Server` для настройки таймаутов чтения/записи и других параметров:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## Тестирование

```sh
curl http://localhost:8080/ping
# Output: pong
```

## Смотрите также

- [Плавный перезапуск или остановка](/ru/docs/server-config/graceful-restart-or-stop/)
- [Запуск нескольких сервисов](/ru/docs/server-config/run-multiple-service/)
