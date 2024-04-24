---
title: "Определить формат для журнала маршрутов"
draft: false
---


По умолчанию журнал маршрутов имеет следующий вид:
```
[GIN-debug] POST /foo --> main.main.func1 (3 handlers)
[GIN-debug] GET /bar --> main.main.func2 (3 handlers)
[GIN-debug] GET /status --> main.main.func3 (3 handlers)
```

Если вы хотите записывать эту информацию в заданном формате (например, JSON, значения ключей или что-то еще), то вы можете определить этот формат с помощью `gin.DebugPrintRouteFunc`.
В примере ниже мы ведем лог всех маршрутов с помощью стандартного пакета лога, но вы можете использовать другие инструменты лога, которые подходят для ваших нужд.
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

	// Listen and Server in http://0.0.0.0:8080
	r.Run()
}
```
