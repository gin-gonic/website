---
title: "Métricas y monitoreo"
sidebar:
  order: 13
---

Exponer métricas de la aplicación te permite monitorear tasas de solicitudes, latencias, tasas de error y uso de recursos en producción. [Prometheus](https://prometheus.io/) es el sistema de monitoreo más común usado con aplicaciones Go.

## Usando gin-contrib/openmetrics

El middleware [gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) proporciona un endpoint de métricas Prometheus listo para usar:

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

## Métricas Prometheus personalizadas

Para más control, usa la biblioteca [prometheus/client_golang](https://github.com/prometheus/client_golang) directamente:

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
Usa `c.FullPath()` (ej. `/user/:id`) en lugar de `c.Request.URL.Path` (ej. `/user/123`) para la etiqueta de ruta. Esto previene etiquetas de alta cardinalidad que pueden abrumar a Prometheus.
:::

## Métricas clave para monitorear

Para una aplicación Gin en producción, rastrea estas métricas:

| Métrica | Tipo | Propósito |
|--------|------|---------|
| `http_requests_total` | Counter | Conteo total de solicitudes por método, ruta, estado |
| `http_request_duration_seconds` | Histogram | Distribución de latencia de solicitudes |
| `http_requests_in_flight` | Gauge | Solicitudes procesándose actualmente |
| `http_response_size_bytes` | Histogram | Tamaños del cuerpo de respuesta |

## Servir métricas en un puerto separado

En producción, sirve métricas en un puerto separado para mantenerlas internas:

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

De esta manera, puedes exponer el puerto 8080 públicamente mientras mantienes el puerto 9090 interno en tu infraestructura.

## Configuración de scrape de Prometheus

Agrega tu aplicación a la configuración de Prometheus:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## Pruebas

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

Deberías ver una salida como:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## Ver también

- [Verificaciones de salud](/es/docs/server-config/health-check/)
- [Ejecutar múltiples servicios](/es/docs/server-config/run-multiple-service/)
