---
title: "Использование middleware"
sidebar:
  order: 2
---

Middleware в Gin — это функции, которые выполняются до (и опционально после) вашего обработчика маршрута. Они используются для сквозных задач, таких как логирование, аутентификация, восстановление после ошибок и модификация запросов.

Gin поддерживает три уровня подключения middleware:

- **Глобальный middleware** — Применяется ко всем маршрутам маршрутизатора. Регистрируется с помощью `router.Use()`. Подходит для задач, таких как логирование и восстановление после паник, которые применяются повсеместно.
- **Middleware группы** — Применяется ко всем маршрутам в группе. Регистрируется с помощью `group.Use()`. Полезен для применения аутентификации или авторизации к подмножеству маршрутов (например, все маршруты `/admin/*`).
- **Middleware маршрута** — Применяется только к одному маршруту. Передаётся как дополнительные аргументы в `router.GET()`, `router.POST()` и т.д. Полезен для специфичной логики маршрута, такой как пользовательское ограничение частоты запросов или валидация ввода.

**Порядок выполнения:** Функции middleware выполняются в порядке их регистрации. Когда middleware вызывает `c.Next()`, он передаёт управление следующему middleware (или финальному обработчику), а затем продолжает выполнение после возврата `c.Next()`. Это создаёт стекоподобный (LIFO) паттерн — первый зарегистрированный middleware начинает первым, но завершается последним. Если middleware не вызывает `c.Next()`, последующие middleware и обработчик пропускаются (полезно для прерывания с помощью `c.Abort()`).

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` — это удобная функция, которая создаёт маршрутизатор с уже подключёнными middleware `Logger` и `Recovery`. Если вам нужен чистый маршрутизатор без middleware, используйте `gin.New()`, как показано выше, и добавьте только нужные вам middleware.
:::
