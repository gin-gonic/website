---
title: "فحوصات الصحة"
sidebar:
  order: 12
---

تسمح نقاط نهاية فحص الصحة لموازنات الحمل والمنسّقين مثل Kubernetes وأنظمة المراقبة بالتحقق من أن تطبيقك يعمل وجاهز لخدمة حركة المرور. يتضمن الإعداد النموذجي نقطتي نهاية: **الحيوية** (هل العملية حية؟) و**الجاهزية** (هل هي جاهزة لقبول الطلبات؟).

## فحص صحة أساسي

نقطة نهاية صحة بسيطة تُرجع 200 OK:

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

## الحيوية مقابل الجاهزية

في Kubernetes والبيئات المشابهة، تحتاج عادةً إلى نوعين من فحوصات الصحة:

- **فحص الحيوية** -- يتحقق مما إذا كانت عملية التطبيق حية. إذا فشل، يتم إعادة تشغيل الحاوية.
- **فحص الجاهزية** -- يتحقق مما إذا كان التطبيق جاهزاً للتعامل مع حركة المرور. إذا فشل، يتم إيقاف حركة المرور مؤقتاً لكن لا تتم إعادة تشغيل الحاوية.

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

## تكوين Kubernetes

كوّن الفحوصات في ملف نشر Kubernetes:

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

## فحص اعتماديات متعددة

للتطبيقات ذات الاعتماديات المتعددة، تحقق من كل واحدة وأبلغ عن الحالة بالتفصيل:

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
عيّن دائماً مهلة زمنية على معالجات فحص الصحة. اتصال قاعدة بيانات معلّق يجب ألا يحظر فحص الصحة إلى أجل غير مسمى -- أرجع حالة غير صحية بدلاً من ذلك.
:::

## الاختبار

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

المخرجات المتوقعة:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## انظر أيضاً

- [إعادة التشغيل أو الإيقاف الرشيق](/ar/docs/server-config/graceful-restart-or-stop/)
- [النشر](/ar/docs/deployment/)
