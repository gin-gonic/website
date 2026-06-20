---
title: "Renderizado"
sidebar:
  order: 5
---

Gin soporta el renderizado de respuestas en múltiples formatos incluyendo JSON, XML, YAML, ProtoBuf, HTML y más. Cada método de renderizado sigue el mismo patrón: llama a un método en `*gin.Context` con un código de estado HTTP y los datos a serializar. Gin maneja los encabezados de tipo de contenido, la serialización y la escritura de la respuesta automáticamente.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

Puedes usar el encabezado `Accept` o un parámetro de consulta para servir los mismos datos en múltiples formatos desde un solo handler:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## En esta sección

- [**Renderizado XML/JSON/YAML/ProtoBuf**](./rendering/) -- Renderizar respuestas en múltiples formatos con manejo automático del tipo de contenido
- [**SecureJSON**](./secure-json/) -- Prevenir ataques de secuestro de JSON en navegadores antiguos
- [**JSONP**](./jsonp/) -- Soportar solicitudes entre dominios desde clientes antiguos sin CORS
- [**AsciiJSON**](./ascii-json/) -- Escapar caracteres no ASCII para transporte seguro
- [**PureJSON**](./pure-json/) -- Renderizar JSON sin escapar caracteres HTML
- [**Servir archivos estáticos**](./serving-static-files/) -- Servir directorios de recursos estáticos
- [**Servir datos desde archivo**](./serving-data-from-file/) -- Servir archivos individuales, adjuntos y descargas
- [**Servir datos desde reader**](./serving-data-from-reader/) -- Transmitir datos desde cualquier `io.Reader` a la respuesta
- [**Renderizado HTML**](./html-rendering/) -- Renderizar plantillas HTML con datos dinámicos
- [**Múltiples plantillas**](./multiple-template/) -- Usar múltiples conjuntos de plantillas en una sola aplicación
- [**Incluir plantillas en un solo binario**](./bind-single-binary-with-template/) -- Incrustar plantillas en tu binario compilado
