---
title: "Definir o Formato para o Registo de Rotas"
draft: false
---

O registo padrão de rotas é:

```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Se quiseres registar esta informação em dado formato (por exemplo, JSON, valores de chave ou outra coisa), então podes definir este formato com `gin.DebugPrintRouteFunc`.
No exemplo abaixo, registamos todas as rotas com o pacote de registo padrão mas podes usar uma outra ferramenta de registo adequada as tuas necessidades:

```go
import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		log.Printf("endpoint %v %v %v %v\n", httpMethod, absolutePath, handlerName, nuHandlers)
	}

	r.POST("/foo", func(c *gin.Context) {
		c.JSON(http.StatusOK, "foo")
	})

	r.GET("/bar", func(c *gin.Context) {
		c.JSON(http.StatusOK, "bar")
	})

	r.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, "ok")
	})

	// Ouvir e servir na http://0.0.0.0:8080
	r.Run()
}
```
