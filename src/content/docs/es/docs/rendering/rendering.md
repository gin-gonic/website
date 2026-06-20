---
title: "Renderizado XML/JSON/YAML/ProtoBuf"
sidebar:
  order: 1
---

Gin proporciona soporte integrado para renderizar respuestas en múltiples formatos incluyendo JSON, XML, YAML y Protocol Buffers. Esto facilita la construcción de APIs que soporten negociación de contenido, sirviendo datos en cualquier formato que el cliente solicite.

**Cuándo usar cada formato:**

- **JSON** -- La opción más común para APIs REST y clientes basados en navegador. Usa `c.JSON()` para salida estándar o `c.IndentedJSON()` para formato legible durante el desarrollo.
- **XML** -- Útil al integrarse con sistemas legacy, servicios SOAP o clientes que esperan XML (como algunas aplicaciones empresariales).
- **YAML** -- Una buena opción para endpoints orientados a configuración o herramientas que consumen YAML nativamente (como Kubernetes o pipelines de CI/CD).
- **ProtoBuf** -- Ideal para comunicación de alto rendimiento y baja latencia entre servicios. Protocol Buffers produce payloads más pequeños y serialización más rápida comparado con formatos basados en texto, pero requiere una definición de esquema compartida (archivo `.proto`).

Todos los métodos de renderizado aceptan un código de estado HTTP y un valor de datos. Gin serializa los datos y establece el encabezado `Content-Type` apropiado automáticamente.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## Ver también

- [PureJSON](/es/docs/rendering/pure-json/)
- [SecureJSON](/es/docs/rendering/secure-json/)
- [AsciiJSON](/es/docs/rendering/ascii-json/)
- [JSONP](/es/docs/rendering/jsonp/)
