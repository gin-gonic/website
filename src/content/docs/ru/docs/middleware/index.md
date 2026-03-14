---
title: "Middleware"
sidebar:
  order: 6
---

Middleware в Gin предоставляет способ обработки HTTP-запросов до их попадания в обработчики маршрутов. Функция middleware имеет ту же сигнатуру, что и обработчик маршрута -- `gin.HandlerFunc` -- и обычно вызывает `c.Next()` для передачи управления следующему обработчику в цепочке.

## Как работает middleware

Gin использует **луковую модель** для выполнения middleware. Каждый middleware выполняется в двух фазах:

1. **Пред-обработчик** -- код до `c.Next()` выполняется до обработчика маршрута.
2. **Пост-обработчик** -- код после `c.Next()` выполняется после возврата обработчика маршрута.

Это означает, что middleware оборачивается вокруг обработчика как слои луковицы. Первый подключённый middleware является внешним слоем.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## Подключение middleware

Существует три способа подключения middleware в Gin:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

Middleware, подключённый на более широком уровне, выполняется первым. В примере выше запрос к `GET /v1/users` выполнит `Logger`, затем `Recovery`, затем `AuthRequired`, затем `listUsers`.

## В этом разделе

- [**Использование middleware**](./using-middleware/) -- Подключение middleware глобально, к группам или отдельным маршрутам
- [**Пользовательский middleware**](./custom-middleware/) -- Написание собственных функций middleware
- [**Использование BasicAuth middleware**](./using-basicauth/) -- HTTP Basic-аутентификация
- [**Горутины внутри middleware**](./goroutines-inside-middleware/) -- Безопасный запуск фоновых задач из middleware
- [**Пользовательская конфигурация HTTP**](./custom-http-config/) -- Обработка ошибок и восстановление в middleware
- [**Заголовки безопасности**](./security-headers/) -- Установка стандартных заголовков безопасности
