---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON com Padding) é uma técnica para fazer requisições cross-domain a partir de navegadores que antecedem o suporte a CORS. Funciona envolvendo uma resposta JSON em uma chamada de função JavaScript. O navegador carrega a resposta via tag `<script>`, que não está sujeita à política de mesma origem, e a função wrapper executa com os dados como argumento.

Quando você chama `c.JSONP()`, o Gin verifica um parâmetro de query `callback`. Se presente, o corpo da resposta é envolvido como `callbackName({"foo":"bar"})` com um `Content-Type` de `application/javascript`. Se nenhum callback for fornecido, a resposta se comporta como uma chamada `c.JSON()` padrão.

:::note
JSONP é uma técnica legada. Para aplicações modernas, use [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) em vez disso. CORS é mais seguro, suporta todos os métodos HTTP (não apenas GET) e não requer envolver respostas em callbacks. Use JSONP apenas quando precisar suportar navegadores muito antigos ou integrar com sistemas de terceiros que o exigem.
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

Teste com curl para ver a diferença entre respostas JSONP e JSON puro:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[Considerações de segurança]
Endpoints JSONP podem ser vulneráveis a ataques XSS se o parâmetro de callback não for devidamente sanitizado. Um valor de callback malicioso como `alert(document.cookie)//` poderia injetar JavaScript arbitrário. O Gin mitiga isso sanitizando o nome do callback, removendo caracteres que poderiam ser usados para injeção. No entanto, você ainda deve limitar endpoints JSONP a dados não sensíveis e somente leitura, já que qualquer página na web pode carregar seu endpoint JSONP via tag `<script>`.
:::

## Veja também

- [Renderização XML/JSON/YAML/ProtoBuf](/pt/docs/rendering/rendering/)
- [SecureJSON](/pt/docs/rendering/secure-json/)
- [AsciiJSON](/pt/docs/rendering/ascii-json/)
- [PureJSON](/pt/docs/rendering/pure-json/)
