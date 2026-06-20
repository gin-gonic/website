---
title: "Verificações de Saúde"
sidebar:
  order: 12
---

Endpoints de verificação de saúde permitem que load balancers, orquestradores como Kubernetes e sistemas de monitoramento verifiquem se sua aplicação está rodando e pronta para servir tráfego. Uma configuração típica inclui dois endpoints: **liveness** (o processo está vivo?) e **readiness** (está pronto para aceitar requisições?).

## Verificação de saúde básica

Um endpoint de saúde simples que retorna 200 OK:

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

Em ambientes Kubernetes e similares, você tipicamente precisa de dois tipos de verificações de saúde:

- **Probe de liveness** -- verifica se o processo da aplicação está vivo. Se falhar, o container é reiniciado.
- **Probe de readiness** -- verifica se a aplicação está pronta para lidar com tráfego. Se falhar, o tráfego é temporariamente parado, mas o container não é reiniciado.

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

## Configuração Kubernetes

Configure probes no manifesto de deployment do Kubernetes:

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

## Verificando múltiplas dependências

Para aplicações com múltiplas dependências, verifique cada uma e reporte status detalhado:

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
Sempre defina um timeout nos handlers de verificação de saúde. Uma conexão de banco de dados travada não deve bloquear a verificação de saúde indefinidamente -- retorne unhealthy em vez disso.
:::

## Testes

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

Saída esperada:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## Veja também

- [Reinicialização ou parada graciosa](/pt/docs/server-config/graceful-restart-or-stop/)
- [Implantação](/pt/docs/deployment/)
