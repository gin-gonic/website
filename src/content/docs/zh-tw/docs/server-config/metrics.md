---
title: "指標與監控"
sidebar:
  order: 13
---

公開應用程式指標讓你可以在正式環境中監控請求速率、延遲時間、錯誤率和資源使用情況。[Prometheus](https://prometheus.io/) 是與 Go 應用程式搭配使用最常見的監控系統。

## 使用 gin-contrib/openmetrics

[gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) 中介軟體提供了開箱即用的 Prometheus 指標端點：

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

## 自訂 Prometheus 指標

如需更多控制，可以直接使用 [prometheus/client_golang](https://github.com/prometheus/client_golang) 函式庫：

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
在路徑標籤中使用 `c.FullPath()`（例如 `/user/:id`）而非 `c.Request.URL.Path`（例如 `/user/123`）。這可以防止高基數標籤導致 Prometheus 負荷過大。
:::

## 需要監控的關鍵指標

對於正式環境的 Gin 應用程式，追蹤以下指標：

| 指標 | 類型 | 用途 |
|--------|------|---------|
| `http_requests_total` | Counter | 按方法、路徑、狀態碼統計的請求總數 |
| `http_request_duration_seconds` | Histogram | 請求延遲分布 |
| `http_requests_in_flight` | Gauge | 目前正在處理的請求數 |
| `http_response_size_bytes` | Histogram | 回應主體大小 |

## 在獨立連接埠上提供指標

在正式環境中，在獨立的連接埠上提供指標以保持其內部存取：

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

這樣你就可以將 8080 連接埠公開暴露，同時讓 9090 連接埠保持在基礎設施內部。

## Prometheus 抓取配置

將你的應用程式新增到 Prometheus 配置中：

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## 測試

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

你應該會看到類似以下的輸出：

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## 另請參閱

- [健康檢查](/zh-tw/docs/server-config/health-check/)
- [執行多個服務](/zh-tw/docs/server-config/run-multiple-service/)
