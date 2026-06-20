---
title: "Metrikler ve İzleme"
sidebar:
  order: 13
---

Uygulama metriklerini açığa çıkarmak, üretimde istek oranlarını, gecikmeleri, hata oranlarını ve kaynak kullanımını izlemenizi sağlar. [Prometheus](https://prometheus.io/), Go uygulamalarıyla kullanılan en yaygın izleme sistemidir.

## gin-contrib/openmetrics kullanımı

[gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) ara katmanı, kullanıma hazır bir Prometheus metrikleri uç noktası sağlar:

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

## Özel Prometheus metrikleri

Daha fazla kontrol için [prometheus/client_golang](https://github.com/prometheus/client_golang) kütüphanesini doğrudan kullanın:

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
Yol etiketi için `c.Request.URL.Path` (ör., `/user/123`) yerine `c.FullPath()` (ör., `/user/:id`) kullanın. Bu, Prometheus'u bunaltabilecek yüksek kardinaliteli etiketleri önler.
:::

## İzlenecek temel metrikler

Üretim Gin uygulaması için bu metrikleri izleyin:

| Metrik | Tür | Amaç |
|--------|-----|-------|
| `http_requests_total` | Counter | Metod, yol, duruma göre toplam istek sayısı |
| `http_request_duration_seconds` | Histogram | İstek gecikme dağılımı |
| `http_requests_in_flight` | Gauge | Şu anda işlenmekte olan istekler |
| `http_response_size_bytes` | Histogram | Yanıt gövde boyutları |

## Metrikleri ayrı bir portta sunma

Üretimde, metrikleri dahili tutmak için ayrı bir portta sunun:

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

Bu şekilde port 8080'i herkese açık olarak sunarken port 9090'ı altyapınıza dahili tutabilirsiniz.

## Prometheus scrape yapılandırması

Uygulamanızı Prometheus yapılandırmasına ekleyin:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## Test etme

```sh
# Generate some traffic
curl http://localhost:8080/ping

# Check metrics
curl http://localhost:9090/metrics
```

Şu tarz çıktı görmelisiniz:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## Ayrıca bakınız

- [Sağlık Kontrolleri](/tr/docs/server-config/health-check/)
- [Birden fazla servis çalıştırma](/tr/docs/server-config/run-multiple-service/)
