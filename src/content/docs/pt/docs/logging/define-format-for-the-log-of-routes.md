---
title: "Definir formato para o log de rotas"
sidebar:
  order: 6
---

Quando o Gin inicia, ele imprime todas as rotas registradas no modo debug. O formato padrão é assim:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Você pode customizar este formato atribuindo uma função a `gin.DebugPrintRouteFunc`. Isso é útil se você quiser registrar rotas como JSON, pares chave-valor ou em qualquer outro formato que seu pipeline de logging espera.

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
    log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
  }

  router.POST("/foo", func(c *gin.Context) {
    c.JSON(http.StatusOK, "foo")
  })

  router.GET("/bar", func(c *gin.Context) {
    c.JSON(http.StatusOK, "bar")
  })

  router.GET("/status", func(c *gin.Context) {
    c.JSON(http.StatusOK, "ok")
  })

  router.Run(":8080")
}
```

Quando o servidor inicia, em vez das linhas padrão `[GIN-debug]`, você verá:

```
endpoint POST /foo main.main.func2 3
endpoint GET /bar main.main.func3 3
endpoint GET /status main.main.func4 3
```

## Veja também

- [Formato de log customizado](/pt/docs/logging/custom-log-format/)
- [Pular logging](/pt/docs/logging/skip-logging/)
