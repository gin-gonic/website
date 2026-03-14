---
title: "متریک‌ها و نظارت"
sidebar:
  order: 13
---

نمایش متریک‌های برنامه به شما امکان نظارت بر نرخ درخواست‌ها، تأخیرها، نرخ خطا و مصرف منابع در تولید را می‌دهد. [Prometheus](https://prometheus.io/) رایج‌ترین سیستم نظارت استفاده شده با برنامه‌های Go است.

## استفاده از gin-contrib/openmetrics

میان‌افزار [gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) یک نقطه پایانی متریک‌های Prometheus آماده استفاده ارائه می‌دهد:

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

## متریک‌های سفارشی Prometheus

برای کنترل بیشتر، مستقیماً از کتابخانه [prometheus/client_golang](https://github.com/prometheus/client_golang) استفاده کنید:

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
از `c.FullPath()` (مثلاً `/user/:id`) به جای `c.Request.URL.Path` (مثلاً `/user/123`) برای برچسب مسیر استفاده کنید. این از برچسب‌های با cardinality بالا که می‌توانند Prometheus را تحت فشار قرار دهند جلوگیری می‌کند.
:::

## متریک‌های کلیدی برای نظارت

برای یک برنامه Gin تولیدی، این متریک‌ها را ردیابی کنید:

| متریک | نوع | هدف |
|--------|------|---------|
| `http_requests_total` | Counter | تعداد کل درخواست‌ها بر اساس متد، مسیر، وضعیت |
| `http_request_duration_seconds` | Histogram | توزیع تأخیر درخواست |
| `http_requests_in_flight` | Gauge | درخواست‌های در حال پردازش |
| `http_response_size_bytes` | Histogram | حجم بدنه پاسخ |

## ارائه متریک‌ها روی پورت جداگانه

در تولید، متریک‌ها را روی پورت جداگانه ارائه دهید تا داخلی بمانند:

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

به این ترتیب، می‌توانید پورت 8080 را به صورت عمومی در معرض قرار دهید در حالی که پورت 9090 داخلی زیرساخت شما باقی می‌ماند.

## پیکربندی scrape در Prometheus

برنامه خود را به پیکربندی Prometheus اضافه کنید:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## تست

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

باید خروجی مانند زیر ببینید:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## همچنین ببینید

- [بررسی سلامت](/fa/docs/server-config/health-check/)
- [اجرای سرویس‌های متعدد](/fa/docs/server-config/run-multiple-service/)
