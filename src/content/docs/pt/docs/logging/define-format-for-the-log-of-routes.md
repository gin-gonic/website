---
title: "Definir formato para o log de rotas"
sidebar:
  order: 6
---

O log padrão de rotas é:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Se você quiser registrar essas informações em um formato específico (ex.: JSON, chave-valor ou outro), então pode definir esse formato com `gin.DebugPrintRouteFunc`.
No exemplo abaixo, registramos todas as rotas com o pacote log padrão, mas você pode usar outra ferramenta de log que atenda às suas necessidades.
```go
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

  // Listen and Server in http://0.0.0.0:8080
  router.Run()
}
```
