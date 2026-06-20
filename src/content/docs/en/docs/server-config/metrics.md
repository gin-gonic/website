---
title: "Metrics and Monitoring"
sidebar:
  order: 13
---

Exposing application metrics allows you to monitor request rates, latencies, error rates, and resource usage in production. [Prometheus](https://prometheus.io/) is the most common monitoring system used with Go applications.

## Using gin-contrib/openmetrics

The [gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) middleware provides a ready-to-use Prometheus metrics endpoint:

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

## Custom Prometheus metrics

For more control, use the [prometheus/client_golang](https://github.com/prometheus/client_golang) library directly:

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
Use `c.FullPath()` (e.g., `/user/:id`) instead of `c.Request.URL.Path` (e.g., `/user/123`) for the path label. This prevents high-cardinality labels that can overwhelm Prometheus.
:::

## Key metrics to monitor

For a production Gin application, track these metrics:

| Metric | Type | Purpose |
|--------|------|---------|
| `http_requests_total` | Counter | Total request count by method, path, status |
| `http_request_duration_seconds` | Histogram | Request latency distribution |
| `http_requests_in_flight` | Gauge | Currently processing requests |
| `http_response_size_bytes` | Histogram | Response body sizes |

## Serving metrics on a separate port

In production, serve metrics on a separate port to keep them internal:

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

This way, you can expose port 8080 publicly while keeping port 9090 internal to your infrastructure.

## Prometheus scrape configuration

Add your application to the Prometheus configuration:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## Testing

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

You should see output like:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## See also

- [Health Checks](/en/docs/server-config/health-check/)
- [Run multiple service](/en/docs/server-config/run-multiple-service/)
