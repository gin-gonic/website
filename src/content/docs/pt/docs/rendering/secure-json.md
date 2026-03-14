---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` protege contra uma classe de vulnerabilidade conhecida como **sequestro de JSON**. Em navegadores mais antigos (principalmente Internet Explorer 9 e anteriores), uma página maliciosa poderia incluir uma tag `<script>` apontando para o endpoint JSON de uma vítima. Se esse endpoint retornasse um array JSON de nível superior (ex.: `["secret","data"]`), o navegador o executaria como JavaScript. Sobrescrevendo o construtor `Array`, o atacante poderia interceptar os valores analisados e vazar dados sensíveis para um servidor de terceiros.

**Como o SecureJSON previne isso:**

Quando os dados da resposta são um array JSON, o `SecureJSON` prepende um prefixo não analisável -- por padrão `while(1);` -- ao corpo da resposta. Isso faz com que o motor JavaScript do navegador entre em um loop infinito se a resposta for carregada via tag `<script>`, impedindo que os dados sejam acessados. Consumidores legítimos da API (usando `fetch`, `XMLHttpRequest` ou qualquer cliente HTTP) leem o corpo bruto da resposta e podem simplesmente remover o prefixo antes de analisar.

As APIs do Google usam uma técnica similar com `)]}'\n`, e o Facebook usa `for(;;);`. Você pode personalizar o prefixo com `router.SecureJsonPrefix()`.

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
Navegadores modernos já corrigiram essa vulnerabilidade, então o `SecureJSON` é principalmente relevante se você precisa suportar navegadores antigos ou se sua política de segurança exige defesa em profundidade. Para a maioria das novas APIs, o `c.JSON()` padrão é suficiente.
:::
