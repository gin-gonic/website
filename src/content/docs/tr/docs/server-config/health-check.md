---
title: "Sağlık Kontrolleri"
sidebar:
  order: 12
---

Sağlık kontrol uç noktaları, yük dengeleyicilerin, Kubernetes gibi orkestratörlerin ve izleme sistemlerinin uygulamanızın çalışır durumda olduğunu ve trafik sunmaya hazır olduğunu doğrulamasına olanak tanır. Tipik bir kurulum iki uç nokta içerir: **liveness** (işlem canlı mı?) ve **readiness** (istek kabul etmeye hazır mı?).

## Temel sağlık kontrolü

200 OK döndüren basit bir sağlık uç noktası:

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

## Liveness ve readiness karşılaştırması

Kubernetes ve benzeri ortamlarda genellikle iki tür sağlık kontrolüne ihtiyacınız vardır:

- **Liveness probe** -- uygulamanın canlı olup olmadığını kontrol eder. Başarısız olursa container yeniden başlatılır.
- **Readiness probe** -- uygulamanın trafik işlemeye hazır olup olmadığını kontrol eder. Başarısız olursa trafik geçici olarak durdurulur ancak container yeniden başlatılmaz.

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

## Kubernetes yapılandırması

Kubernetes dağıtım manifestinizde probe'ları yapılandırın:

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

## Birden fazla bağımlılığı kontrol etme

Birden fazla bağımlılığa sahip uygulamalar için her birini kontrol edin ve ayrıntılı durum raporlayın:

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
Sağlık kontrol işleyicilerinde her zaman bir zaman aşımı ayarlayın. Askıda kalan bir veritabanı bağlantısı sağlık kontrolünü süresiz olarak engellememeli -- bunun yerine sağlıksız olarak döndürün.
:::

## Test etme

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

Beklenen çıktı:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## Ayrıca bakınız

- [Zarif yeniden başlatma veya durdurma](/tr/docs/server-config/graceful-restart-or-stop/)
- [Dağıtım](/tr/docs/deployment/)
