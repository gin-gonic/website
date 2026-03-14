---
title: "Проверки работоспособности"
sidebar:
  order: 12
---

Эндпоинты проверки работоспособности позволяют балансировщикам нагрузки, оркестраторам вроде Kubernetes и системам мониторинга проверять, что ваше приложение работает и готово обслуживать трафик. Типичная настройка включает два эндпоинта: **liveness** (жив ли процесс?) и **readiness** (готов ли он принимать запросы?).

## Базовая проверка работоспособности

Простой эндпоинт проверки, возвращающий 200 OK:

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

## Liveness vs readiness

В Kubernetes и подобных средах обычно нужны два типа проверок работоспособности:

- **Liveness probe** — проверяет, жив ли процесс приложения. При неудаче контейнер перезапускается.
- **Readiness probe** — проверяет, готово ли приложение обрабатывать трафик. При неудаче трафик временно останавливается, но контейнер не перезапускается.

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

  // Liveness: is the process alive?
  r.GET("/healthz", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"status": "alive"})
  })

  // Readiness: can we serve traffic?
  r.GET("/readyz", func(c *gin.Context) {
    if !isReady.Load() {
      c.JSON(http.StatusServiceUnavailable, gin.H{"status": "not ready"})
      return
    }

    // Check database connectivity
    if err := db.Ping(); err != nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{
        "status": "not ready",
        "reason": "database unreachable",
      })
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "ready"})
  })

  // Mark as ready after initialization is complete
  isReady.Store(true)

  r.Run(":8080")
}
```

## Конфигурация Kubernetes

Настройте проверки в манифесте развёртывания Kubernetes:

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

## Проверка нескольких зависимостей

Для приложений с несколькими зависимостями проверяйте каждую и сообщайте подробный статус:

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

  // Check database
  if err := h.DB.PingContext(ctx); err != nil {
    checks["database"] = gin.H{"status": "unhealthy", "error": err.Error()}
    healthy = false
  } else {
    checks["database"] = gin.H{"status": "healthy"}
  }

  // Check Redis
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
Always set a timeout on health check handlers. A hanging database connection should not block the health check indefinitely — return unhealthy instead.
:::

## Testing

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

Expected output:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## See also

- [Graceful restart or stop](/en/docs/server-config/graceful-restart-or-stop/)
- [Deployment](/en/docs/deployment/)
