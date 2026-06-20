---
title: "بررسی سلامت"
sidebar:
  order: 12
---

نقاط پایانی بررسی سلامت به متعادل‌کننده‌های بار، ارکستراتورهایی مانند Kubernetes و سیستم‌های نظارت اجازه می‌دهند تأیید کنند برنامه شما در حال اجرا و آماده ارائه ترافیک است. یک تنظیم معمولی شامل دو نقطه پایانی است: **liveness** (آیا فرآیند زنده است؟) و **readiness** (آیا آماده پذیرش درخواست‌ها است؟).

## بررسی سلامت پایه

یک نقطه پایانی سلامت ساده که 200 OK برمی‌گرداند:

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

## Liveness در مقابل readiness

در Kubernetes و محیط‌های مشابه، معمولاً به دو نوع بررسی سلامت نیاز دارید:

- **Liveness probe** -- بررسی می‌کند آیا فرآیند برنامه زنده است. اگر شکست بخورد، container راه‌اندازی مجدد می‌شود.
- **Readiness probe** -- بررسی می‌کند آیا برنامه آماده مدیریت ترافیک است. اگر شکست بخورد، ترافیک به طور موقت متوقف می‌شود اما container راه‌اندازی مجدد نمی‌شود.

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

## پیکربندی Kubernetes

probeها را در مانیفست استقرار Kubernetes خود پیکربندی کنید:

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

## بررسی وابستگی‌های متعدد

برای برنامه‌هایی با وابستگی‌های متعدد، هر کدام را بررسی کنید و وضعیت جزئی گزارش دهید:

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
همیشه یک timeout روی handlerهای بررسی سلامت تنظیم کنید. یک اتصال پایگاه داده معلق نباید بررسی سلامت را به طور نامحدود مسدود کند -- به جای آن unhealthy برگردانید.
:::

## تست

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

خروجی مورد انتظار:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## همچنین ببینید

- [راه‌اندازی مجدد یا توقف آرام](/fa/docs/server-config/graceful-restart-or-stop/)
- [استقرار](/fa/docs/deployment/)
