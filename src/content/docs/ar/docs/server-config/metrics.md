---
title: "المقاييس والمراقبة"
sidebar:
  order: 13
---

يتيح لك كشف مقاييس التطبيق مراقبة معدلات الطلبات والتأخيرات ومعدلات الأخطاء واستخدام الموارد في الإنتاج. [Prometheus](https://prometheus.io/) هو نظام المراقبة الأكثر شيوعاً المستخدم مع تطبيقات Go.

## استخدام gin-contrib/openmetrics

يوفر وسيط [gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) نقطة نهاية مقاييس Prometheus جاهزة للاستخدام:

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

## مقاييس Prometheus مخصصة

لمزيد من التحكم، استخدم مكتبة [prometheus/client_golang](https://github.com/prometheus/client_golang) مباشرة:

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
استخدم `c.FullPath()` (مثل `/user/:id`) بدلاً من `c.Request.URL.Path` (مثل `/user/123`) لعلامة المسار. هذا يمنع العلامات عالية العدد التي يمكن أن تُرهق Prometheus.
:::

## المقاييس الرئيسية للمراقبة

لتطبيق Gin في الإنتاج، تتبع هذه المقاييس:

| المقياس | النوع | الغرض |
|--------|------|---------|
| `http_requests_total` | عدّاد | إجمالي عدد الطلبات حسب الطريقة والمسار والحالة |
| `http_request_duration_seconds` | مدرج تكراري | توزيع تأخير الطلبات |
| `http_requests_in_flight` | مقياس | الطلبات قيد المعالجة حالياً |
| `http_response_size_bytes` | مدرج تكراري | أحجام جسم الاستجابة |

## تقديم المقاييس على منفذ منفصل

في الإنتاج، قدّم المقاييس على منفذ منفصل لإبقائها داخلية:

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

بهذه الطريقة، يمكنك كشف المنفذ 8080 للعموم مع إبقاء المنفذ 9090 داخلياً في بنيتك التحتية.

## تكوين جمع Prometheus

أضف تطبيقك إلى تكوين Prometheus:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## الاختبار

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

يجب أن ترى مخرجات مثل:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## انظر أيضاً

- [فحوصات الصحة](/ar/docs/server-config/health-check/)
- [تشغيل خدمات متعددة](/ar/docs/server-config/run-multiple-service/)
