---
title: "Метрики и мониторинг"
sidebar:
  order: 13
---

Экспорт метрик приложения позволяет отслеживать частоту запросов, задержки, частоту ошибок и использование ресурсов в продакшене. [Prometheus](https://prometheus.io/) — наиболее распространённая система мониторинга, используемая с приложениями на Go.

## Использование gin-contrib/openmetrics

Middleware [gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) предоставляет готовый к использованию эндпоинт метрик Prometheus:

```sh
go get github.com/gin-contrib/openmetrics
```

```go
package main

import (
  "github.com/gin-contrib/openmetrics"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Expose /metrics endpoint for Prometheus scraping
  r.Use(openmetrics.NewOpenMetrics("myapp", openmetrics.WithExpose()))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

## Пользовательские метрики Prometheus

Для большего контроля используйте библиотеку [prometheus/client_golang](https://github.com/prometheus/client_golang) напрямую:

```go
package main

import (
  "strconv"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/prometheus/client_golang/prometheus"
  "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
  httpRequestsTotal = prometheus.NewCounterVec(
    prometheus.CounterOpts{
      Name: "http_requests_total",
      Help: "Total number of HTTP requests",
    },
    []string{"method", "path", "status"},
  )

  httpRequestDuration = prometheus.NewHistogramVec(
    prometheus.HistogramOpts{
      Name:    "http_request_duration_seconds",
      Help:    "HTTP request duration in seconds",
      Buckets: prometheus.DefBuckets,
    },
    []string{"method", "path"},
  )
)

func init() {
  prometheus.MustRegister(httpRequestsTotal)
  prometheus.MustRegister(httpRequestDuration)
}

func MetricsMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    c.Next()

    duration := time.Since(start).Seconds()
    status := strconv.Itoa(c.Writer.Status())

    httpRequestsTotal.WithLabelValues(c.Request.Method, c.FullPath(), status).Inc()
    httpRequestDuration.WithLabelValues(c.Request.Method, c.FullPath()).Observe(duration)
  }
}

func main() {
  r := gin.Default()
  r.Use(MetricsMiddleware())

  // Expose metrics endpoint (separate from application routes)
  r.GET("/metrics", gin.WrapH(promhttp.Handler()))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

:::note
Используйте `c.FullPath()` (например, `/user/:id`) вместо `c.Request.URL.Path` (например, `/user/123`) для метки пути. Это предотвращает создание меток с высокой кардинальностью, которые могут перегрузить Prometheus.
:::

## Ключевые метрики для мониторинга

Для приложения Gin в продакшене отслеживайте следующие метрики:

| Метрика | Тип | Назначение |
|--------|------|---------|
| `http_requests_total` | Counter | Общее количество запросов по методу, пути, статусу |
| `http_request_duration_seconds` | Histogram | Распределение задержек запросов |
| `http_requests_in_flight` | Gauge | Запросы, обрабатываемые в данный момент |
| `http_response_size_bytes` | Histogram | Размеры тел ответов |

## Метрики на отдельном порту

В продакшене раздавайте метрики на отдельном порту, чтобы они были доступны только внутри:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
  // Application server
  app := gin.Default()
  app.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  // Metrics server on a separate port
  go func() {
    metrics := http.NewServeMux()
    metrics.Handle("/metrics", promhttp.Handler())
    http.ListenAndServe(":9090", metrics)
  }()

  app.Run(":8080")
}
```

Таким образом, вы можете открыть порт 8080 публично, а порт 9090 оставить внутренним для вашей инфраструктуры.

## Конфигурация сбора метрик Prometheus

Добавьте ваше приложение в конфигурацию Prometheus:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## Тестирование

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

Вы должны увидеть вывод вроде:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## Смотрите также

- [Проверки работоспособности](/ru/docs/server-config/health-check/)
- [Запуск нескольких сервисов](/ru/docs/server-config/run-multiple-service/)
