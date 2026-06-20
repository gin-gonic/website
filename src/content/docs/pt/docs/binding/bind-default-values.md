---
title: "Valores padrão para campos de formulário"
sidebar:
  order: 5
---

Às vezes você quer que um campo use um valor padrão quando o cliente não envia um valor. O binding de formulários do Gin suporta valores padrão através da opção `default` na tag de struct `form`. Isso funciona para escalares e, a partir do Gin v1.11, para coleções (slices/arrays) com formatos de coleção explícitos.

Pontos-chave:

- Coloque o padrão logo após a chave do formulário: `form:"name,default=William"`.
- Para coleções, especifique como dividir os valores com `collection_format:"multi|csv|ssv|tsv|pipes"`.
- Para `multi` e `csv`, use ponto e vírgula no padrão para separar valores (ex.: `default=1;2;3`). O Gin converte-os internamente em vírgulas para que o parser de tags não fique ambíguo.
- Para `ssv` (espaço), `tsv` (tab) e `pipes` (|), use o separador natural no padrão.

Exemplo:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; in defaults
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infers binder by Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

Se você fizer POST sem corpo, o Gin responde com os valores padrão:

```sh
curl -X POST http://localhost:8080/person
```

Resposta (exemplo):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

Notas e ressalvas:

- Vírgulas são usadas pela sintaxe de tags de struct do Go para separar opções; evite vírgulas dentro de valores padrão.
- Para `multi` e `csv`, ponto e vírgula separam valores padrão; não inclua ponto e vírgula dentro de padrões individuais para esses formatos.
- Valores inválidos de `collection_format` resultarão em um erro de binding.

Alterações relacionadas:

- Os formatos de coleção para binding de formulários (`multi`, `csv`, `ssv`, `tsv`, `pipes`) foram aprimorados por volta do v1.11.
- Valores padrão para coleções foram adicionados no v1.11 (PR #4048).
