---
title: "ヘルスチェック"
sidebar:
  order: 12
---

ヘルスチェックエンドポイントにより、ロードバランサー、Kubernetesなどのオーケストレーター、モニタリングシステムがアプリケーションが実行中でトラフィックを処理する準備ができているかを確認できます。典型的なセットアップには2つのエンドポイントが含まれます：**liveness**（プロセスは生きているか？）と**readiness**（リクエストを受け付ける準備ができているか？）。

## 基本的なヘルスチェック

200 OKを返すシンプルなヘルスエンドポイント：

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

Kubernetesおよび類似の環境では、通常2種類のヘルスチェックが必要です：

- **Livenessプローブ** -- アプリケーションプロセスが生きているかチェックします。失敗した場合、コンテナが再起動されます。
- **Readinessプローブ** -- アプリケーションがトラフィックを処理する準備ができているかチェックします。失敗した場合、トラフィックは一時的に停止されますが、コンテナは再起動されません。

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

## Kubernetes設定

Kubernetesデプロイメントマニフェストでプローブを設定します：

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

## 複数の依存関係のチェック

複数の依存関係を持つアプリケーションでは、各依存関係をチェックして詳細なステータスを報告します：

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
ヘルスチェックハンドラには常にタイムアウトを設定してください。ハングしたデータベース接続がヘルスチェックを無期限にブロックすべきではありません。代わりにunhealthyを返してください。
:::

## テスト

```sh
# Check liveness
curl -i http://localhost:8080/healthz

# Check readiness
curl -i http://localhost:8080/readyz
```

期待される出力：

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ready"}
```

## 関連項目

- [グレースフルリスタートまたは停止](/ja/docs/server-config/graceful-restart-or-stop/)
- [デプロイメント](/ja/docs/deployment/)
