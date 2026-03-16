---
title: "Parámetros en la ruta"
sidebar:
  order: 2
---

Gin admite dos tipos de parámetros de ruta que permiten capturar valores directamente de la URL:

- **`:name`** — coincide con un solo segmento de ruta. Por ejemplo, `/user/:name` coincide con `/user/john` pero **no** coincide con `/user/` ni `/user`.
- **`*action`** — coincide con todo lo que sigue después del prefijo, incluidas las barras. Por ejemplo, `/user/:name/*action` coincide con `/user/john/send` y `/user/john/`. El valor capturado incluye la `/` inicial.

Usa `c.Param("name")` para obtener el valor de un parámetro de ruta dentro de tu handler.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## Pruébalo

```sh
# Parámetro simple -- coincide con :name
curl http://localhost:8080/user/john
# Output: Hello john

# Parámetro comodín -- coincide con :name y *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# La barra final es capturada por el comodín
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
El valor del comodín `*action` siempre incluye la `/` inicial. En el ejemplo anterior, `c.Param("action")` devuelve `/send`, no `send`.
:::

:::caution
No puedes definir tanto `/user/:name` como `/user/:name/*action` si entran en conflicto en la misma profundidad de ruta. Gin generará un panic al iniciar si detecta rutas ambiguas.
:::

## Ver también

- [Parámetros de cadena de consulta](/es/docs/routing/querystring-param/)
- [Consulta y formulario post](/es/docs/routing/query-and-post-form/)
