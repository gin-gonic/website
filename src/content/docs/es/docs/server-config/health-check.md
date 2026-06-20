---
title: "Verificaciones de salud"
sidebar:
  order: 12
---

Los endpoints de verificación de salud permiten a los balanceadores de carga, orquestadores como Kubernetes y sistemas de monitoreo verificar que tu aplicación está ejecutándose y lista para servir tráfico. Una configuración típica incluye dos endpoints: **liveness** (¿está vivo el proceso?) y **readiness** (¿está listo para aceptar solicitudes?).

## Verificación de salud básica

Un endpoint de salud simple que devuelve 200 OK:

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

En Kubernetes y entornos similares, típicamente necesitas dos tipos de verificaciones de salud:

- **Sonda liveness** -- verifica si el proceso de la aplicación está vivo. Si falla, el contenedor se reinicia.
- **Sonda readiness** -- verifica si la aplicación está lista para manejar tráfico. Si falla, el tráfico se detiene temporalmente pero el contenedor no se reinicia.

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

## Configuración de Kubernetes

Configura las sondas en tu manifiesto de deployment de Kubernetes:

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

## Verificar múltiples dependencias

Para aplicaciones con múltiples dependencias, verifica cada una y reporta el estado detallado:

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
Siempre establece un tiempo de espera en los handlers de verificación de salud. Una conexión de base de datos colgada no debería bloquear la verificación de salud indefinidamente -- devuelve unhealthy en su lugar.
:::

## Pruebas

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

Salida esperada:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## Ver también

- [Reinicio o parada elegante](/es/docs/server-config/graceful-restart-or-stop/)
- [Despliegue](/es/docs/deployment/)
