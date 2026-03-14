---
title: "메트릭 및 모니터링"
sidebar:
  order: 13
---

애플리케이션 메트릭을 노출하면 프로덕션에서 요청 속도, 지연 시간, 오류율, 리소스 사용량을 모니터링할 수 있습니다. [Prometheus](https://prometheus.io/)는 Go 애플리케이션에서 가장 일반적으로 사용되는 모니터링 시스템입니다.

## gin-contrib/openmetrics 사용하기

[gin-contrib/openmetrics](https://github.com/gin-contrib/openmetrics) 미들웨어는 바로 사용할 수 있는 Prometheus 메트릭 엔드포인트를 제공합니다:

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

  // Prometheus 스크래핑을 위한 /metrics 엔드포인트 노출
  r.Use(openmetrics.NewOpenMetrics("myapp", openmetrics.WithExpose()))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

## 커스텀 Prometheus 메트릭

더 많은 제어를 위해 [prometheus/client_golang](https://github.com/prometheus/client_golang) 라이브러리를 직접 사용합니다:

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

  // 메트릭 엔드포인트 노출 (애플리케이션 라우트와 별도)
  r.GET("/metrics", gin.WrapH(promhttp.Handler()))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run(":8080")
}
```

:::note
경로 레이블에 `c.Request.URL.Path` (예: `/user/123`) 대신 `c.FullPath()` (예: `/user/:id`)를 사용하세요. 이렇게 하면 Prometheus를 압도할 수 있는 높은 카디널리티 레이블을 방지합니다.
:::

## 모니터링할 주요 메트릭

프로덕션 Gin 애플리케이션에서는 다음 메트릭을 추적합니다:

| 메트릭 | 유형 | 목적 |
|--------|------|---------|
| `http_requests_total` | Counter | 메서드, 경로, 상태별 총 요청 수 |
| `http_request_duration_seconds` | Histogram | 요청 지연 시간 분포 |
| `http_requests_in_flight` | Gauge | 현재 처리 중인 요청 |
| `http_response_size_bytes` | Histogram | 응답 바디 크기 |

## 별도 포트에서 메트릭 서빙

프로덕션에서는 메트릭을 내부로 유지하기 위해 별도 포트에서 서빙합니다:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
  // 애플리케이션 서버
  app := gin.Default()
  app.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  // 별도 포트의 메트릭 서버
  go func() {
    metrics := http.NewServeMux()
    metrics.Handle("/metrics", promhttp.Handler())
    http.ListenAndServe(":9090", metrics)
  }()

  app.Run(":8080")
}
```

이렇게 하면 포트 8080은 공개적으로 노출하고 포트 9090은 인프라 내부로 유지할 수 있습니다.

## Prometheus 스크래핑 설정

애플리케이션을 Prometheus 설정에 추가합니다:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "gin-app"
    scrape_interval: 15s
    static_configs:
      - targets: ["localhost:9090"]
```

## 테스트

```sh
# 트래픽 생성
curl http://localhost:8080/ping

# 메트릭 확인
curl http://localhost:9090/metrics
```

다음과 같은 출력을 확인할 수 있습니다:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",path="/ping",status="200"} 1

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",path="/ping",le="0.005"} 1
...
```

## 참고

- [헬스 체크](/ko-kr/docs/server-config/health-check/)
- [다중 서비스 실행](/ko-kr/docs/server-config/run-multiple-service/)
