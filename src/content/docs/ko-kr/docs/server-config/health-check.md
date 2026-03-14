---
title: "헬스 체크"
sidebar:
  order: 12
---

헬스 체크 엔드포인트는 로드 밸런서, Kubernetes와 같은 오케스트레이터, 모니터링 시스템이 애플리케이션이 실행 중이고 트래픽을 처리할 준비가 되었는지 확인할 수 있게 합니다. 일반적인 설정에는 두 가지 엔드포인트가 포함됩니다: **liveness** (프로세스가 살아있는가?) 및 **readiness** (요청을 받을 준비가 되었는가?).

## 기본 헬스 체크

200 OK를 반환하는 간단한 헬스 엔드포인트:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/healthz", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"status": "ok"})
  })

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  r.Run(":8080")
}
```

## Liveness vs Readiness

Kubernetes 및 유사한 환경에서는 일반적으로 두 가지 유형의 헬스 체크가 필요합니다:

- **Liveness 프로브** -- 애플리케이션 프로세스가 살아있는지 확인합니다. 실패하면 컨테이너가 재시작됩니다.
- **Readiness 프로브** -- 애플리케이션이 트래픽을 처리할 준비가 되었는지 확인합니다. 실패하면 트래픽이 일시적으로 중단되지만 컨테이너는 재시작되지 않습니다.

```go
package main

import (
  "database/sql"
  "net/http"
  "sync/atomic"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

var isReady atomic.Bool

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname?sslmode=disable")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // Liveness: 프로세스가 살아있는가?
  r.GET("/healthz", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"status": "alive"})
  })

  // Readiness: 트래픽을 처리할 수 있는가?
  r.GET("/readyz", func(c *gin.Context) {
    if !isReady.Load() {
      c.JSON(http.StatusServiceUnavailable, gin.H{"status": "not ready"})
      return
    }

    // 데이터베이스 연결 확인
    if err := db.Ping(); err != nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{
        "status": "not ready",
        "reason": "database unreachable",
      })
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "ready"})
  })

  // 초기화가 완료된 후 준비 상태로 표시
  isReady.Store(true)

  r.Run(":8080")
}
```

## Kubernetes 설정

Kubernetes 배포 매니페스트에서 프로브를 설정합니다:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-gin-app
spec:
  template:
    spec:
      containers:
        - name: app
          image: my-gin-app:latest
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```

## 여러 의존성 확인

여러 의존성을 가진 애플리케이션의 경우, 각각을 확인하고 상세한 상태를 보고합니다:

```go
package main

import (
  "context"
  "database/sql"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/redis/go-redis/v9"
)

type HealthChecker struct {
  DB    *sql.DB
  Redis *redis.Client
}

func (h *HealthChecker) CheckHealth(c *gin.Context) {
  ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
  defer cancel()

  checks := gin.H{}
  healthy := true

  // 데이터베이스 확인
  if err := h.DB.PingContext(ctx); err != nil {
    checks["database"] = gin.H{"status": "unhealthy", "error": err.Error()}
    healthy = false
  } else {
    checks["database"] = gin.H{"status": "healthy"}
  }

  // Redis 확인
  if err := h.Redis.Ping(ctx).Err(); err != nil {
    checks["redis"] = gin.H{"status": "unhealthy", "error": err.Error()}
    healthy = false
  } else {
    checks["redis"] = gin.H{"status": "healthy"}
  }

  status := http.StatusOK
  if !healthy {
    status = http.StatusServiceUnavailable
  }

  c.JSON(status, gin.H{
    "status": map[bool]string{true: "healthy", false: "unhealthy"}[healthy],
    "checks": checks,
  })
}
```

:::note
헬스 체크 핸들러에 항상 타임아웃을 설정하세요. 멈춘 데이터베이스 연결이 헬스 체크를 무기한 차단해서는 안 됩니다 -- 대신 비정상으로 반환하세요.
:::

## 테스트

```sh
# Liveness 확인
curl -i http://localhost:8080/healthz

# Readiness 확인
curl -i http://localhost:8080/readyz
```

예상 출력:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## 참고

- [우아한 재시작 또는 중지](/ko-kr/docs/server-config/graceful-restart-or-stop/)
- [배포](/ko-kr/docs/deployment/)
