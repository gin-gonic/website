---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON con Padding) es una técnica para realizar solicitudes entre dominios desde navegadores anteriores al soporte de CORS. Funciona envolviendo una respuesta JSON en una llamada a función JavaScript. El navegador carga la respuesta a través de una etiqueta `<script>`, que no está sujeta a la política de mismo origen, y la función envolvente se ejecuta con los datos como argumento.

Cuando llamas a `c.JSONP()`, Gin busca un parámetro de consulta `callback`. Si está presente, el cuerpo de la respuesta se envuelve como `callbackName({"foo":"bar"})` con un `Content-Type` de `application/javascript`. Si no se proporciona callback, la respuesta se comporta como una llamada estándar `c.JSON()`.

:::note
JSONP es una técnica legacy. Para aplicaciones modernas, usa [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) en su lugar. CORS es más seguro, soporta todos los métodos HTTP (no solo GET), y no requiere envolver las respuestas en callbacks. Usa JSONP solo cuando necesites soportar navegadores muy antiguos o integrarte con sistemas de terceros que lo requieran.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Prueba con curl para ver la diferencia entre las respuestas JSONP y JSON estándar:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[Consideraciones de seguridad]
Los endpoints JSONP pueden ser vulnerables a ataques XSS si el parámetro callback no se sanitiza adecuadamente. Un valor de callback malicioso como `alert(document.cookie)//` podría inyectar JavaScript arbitrario. Gin mitiga esto sanitizando el nombre del callback, eliminando caracteres que podrían usarse para inyección. Sin embargo, aún deberías limitar los endpoints JSONP a datos no sensibles y de solo lectura, ya que cualquier página en la web puede cargar tu endpoint JSONP a través de una etiqueta `<script>`.
:::

## Ver también

- [Renderizado XML/JSON/YAML/ProtoBuf](/es/docs/rendering/rendering/)
- [SecureJSON](/es/docs/rendering/secure-json/)
- [AsciiJSON](/es/docs/rendering/ascii-json/)
- [PureJSON](/es/docs/rendering/pure-json/)
