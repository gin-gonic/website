---
title: "Definir el formato para el log de rutas"
draft: false
---

El log de rutas por defecto es:
```
[GIN-debug] POST   /foo                      --> main.main.func1 (3 handlers)
[GIN-debug] GET    /bar                      --> main.main.func2 (3 handlers)
[GIN-debug] GET    /status                   --> main.main.func3 (3 handlers)
```

Si se desea registrar la información en un formato dado (Ejemplo, registrando valores de la petición, JSON, o algo más), se puede definir el formato con `gin.DebugPrintRouteFunc`.
En el siguiente ejemplo se registran todas las rutas con el paquete estandar de log, sin embargo se puede emplear otro paquete de log que se adapte a lo necesitado.

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

	// Escucha y sirve peticiones en 0.0.0.0:8080
	r.Run(":8080")
}
```
