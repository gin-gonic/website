---
title: "Métricas e Monitoramento"
sidebar:
  order: 13
---

Expor métricas da aplicação permite monitorar taxas de requisição, latências, taxas de erro e uso de recursos em produção. [Prometheus](https://prometheus.io/) é o sistema de monitoramento mais comum usado com aplicações Go.

## Usando gin-contrib/openmetrics

O middleware [gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) fornece um endpoint de métricas Prometheus pronto para uso:

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

## Métricas Prometheus customizadas

Para mais controle, use a biblioteca [prometheus/client_golang](https://github.com/prometheus/client_golang) diretamente:

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
Use `c.FullPath()` (ex.: `/user/:id`) em vez de `c.Request.URL.Path` (ex.: `/user/123`) para o label de caminho. Isso previne labels de alta cardinalidade que podem sobrecarregar o Prometheus.
:::

## Métricas principais para monitorar

Para uma aplicação Gin em produção, acompanhe estas métricas:

| Metric | Type | Purpose |
|--------|------|---------|
| `http_requests_total` | Counter | Total request count by method, path, status |
| `http_request_duration_seconds` | Histogram | Request latency distribution |
| `http_requests_in_flight` | Gauge | Currently processing requests |
| `http_response_size_bytes` | Histogram | Response body sizes |

## Servindo métricas em uma porta separada

Em produção, sirva métricas em uma porta separada para mantê-las internas:

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

Dessa forma, você pode expor a porta 8080 publicamente enquanto mantém a porta 9090 interna à sua infraestrutura.

## Configuração de scrape do Prometheus

Adicione sua aplicação à configuração do Prometheus:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## Testes

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

Você deverá ver uma saída como:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## Veja também

- [Verificações de Saúde](/pt/docs/server-config/health-check/)
- [Executar múltiplos serviços](/pt/docs/server-config/run-multiple-service/)
