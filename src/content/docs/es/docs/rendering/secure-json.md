---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` protege contra una clase de vulnerabilidad conocida como **secuestro de JSON**. En navegadores antiguos (principalmente Internet Explorer 9 y anteriores), una página maliciosa podría incluir una etiqueta `<script>` apuntando al endpoint de la API JSON de la víctima. Si ese endpoint devolvía un array JSON de nivel superior (ej. `["secret","data"]`), el navegador lo ejecutaría como JavaScript. Sobreescribiendo el constructor de `Array`, el atacante podría interceptar los valores analizados y filtrar datos sensibles a un servidor de terceros.

**Cómo SecureJSON previene esto:**

Cuando los datos de respuesta son un array JSON, `SecureJSON` antepone un prefijo no analizable, por defecto `while(1);`, al cuerpo de la respuesta. Esto causa que el motor JavaScript del navegador entre en un bucle infinito si la respuesta se carga a través de una etiqueta `<script>`, previniendo el acceso a los datos. Los consumidores legítimos de la API (usando `fetch`, `XMLHttpRequest` o cualquier cliente HTTP) leen el cuerpo de respuesta sin procesar y pueden simplemente eliminar el prefijo antes de analizar.

Las APIs de Google usan una técnica similar con `)]}'\n`, y Facebook usa `for(;;);`. Puedes personalizar el prefijo con `router.SecureJsonPrefix()`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // You can also use your own secure json prefix
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
Los navegadores modernos han corregido esta vulnerabilidad, por lo que `SecureJSON` es principalmente relevante si necesitas soportar navegadores legacy o si tu política de seguridad requiere defensa en profundidad. Para la mayoría de las APIs nuevas, el estándar `c.JSON()` es suficiente.
:::
