---
title: "メトリクスとモニタリング"
sidebar:
  order: 13
---

アプリケーションメトリクスを公開することで、本番環境でのリクエストレート、レイテンシ、エラーレート、リソース使用量を監視できます。[Prometheus](https://prometheus.io/)はGoアプリケーションで最も一般的に使用されるモニタリングシステムです。

## gin-contrib/openmetricsの使用

[gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics)ミドルウェアは、すぐに使えるPrometheusメトリクスエンドポイントを提供します：

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

## カスタムPrometheusメトリクス

より細かい制御が必要な場合は、[prometheus/client_golang](https://github.com/prometheus/client_golang)ライブラリを直接使用します：

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
パスラベルには`c.Request.URL.Path`（例：`/user/123`）ではなく`c.FullPath()`（例：`/user/:id`）を使用してください。これにより、Prometheusを圧倒する可能性のある高カーディナリティラベルを防ぎます。
:::

## 監視すべき主要メトリクス

本番Ginアプリケーションでは、以下のメトリクスを追跡します：

| Metric | Type | Purpose |
|--------|------|---------|
| `http_requests_total` | Counter | Total request count by method, path, status |
| `http_request_duration_seconds` | Histogram | Request latency distribution |
| `http_requests_in_flight` | Gauge | Currently processing requests |
| `http_response_size_bytes` | Histogram | Response body sizes |

## 別ポートでのメトリクス配信

本番環境では、メトリクスを内部に保つために別のポートで配信します：

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

これにより、ポート8080を公開しつつ、ポート9090をインフラストラクチャ内部に保つことができます。

## Prometheusスクレイプ設定

アプリケーションをPrometheus設定に追加します：

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

## 関連項目

- [ヘルスチェック](/ja/docs/server-config/health-check/)
- [複数サービスの実行](/ja/docs/server-config/run-multiple-service/)
