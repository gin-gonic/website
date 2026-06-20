---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` serializa dados para JSON, mas escapa todos os caracteres não-ASCII em sequências de escape Unicode `\uXXXX`. Caracteres especiais de HTML como `<` e `>` também são escapados. O resultado é um corpo de resposta que contém apenas caracteres ASCII de 7 bits.

**Quando usar AsciiJSON:**

- Seus consumidores de API exigem respostas estritamente seguras em ASCII (por exemplo, sistemas que não conseguem lidar com bytes codificados em UTF-8).
- Você precisa incorporar JSON dentro de contextos que suportam apenas ASCII, como certos sistemas de logging ou transportes legados.
- Você quer garantir que caracteres como `<`, `>` e `&` sejam escapados para evitar problemas de injeção quando JSON é incorporado em HTML.

Para a maioria das APIs modernas, o `c.JSON()` padrão é suficiente, pois produz UTF-8 válido. Use `AsciiJSON` apenas quando a segurança ASCII for um requisito específico.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Você pode testar este endpoint com curl:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

Note que os caracteres chineses são substituídos por `\u8bed\u8a00`, e a tag `<br>` se torna `\u003cbr\u003e`. O corpo da resposta é seguro para consumo em qualquer ambiente somente ASCII.
