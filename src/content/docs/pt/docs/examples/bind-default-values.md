---
title: "Vincular valores padrão para campos de formulário"
---

Às vezes você quer que um campo use um valor padrão quando o cliente não envia um valor. A vinculação de formulários do Gin suporta valores padrão através da opção `default` na tag de struct `form`. Isso funciona para escalares e, a partir do Gin v1.11, para coleções (slices/arrays) com formatos de coleção explícitos.

Pontos principais:

- Coloque o valor padrão logo após a chave do formulário: `form:"name,default=William"`.
- Para coleções, especifique como dividir os valores com `collection_format:"multi|csv|ssv|tsv|pipes"`.
- Para `multi` e `csv`, use ponto e vírgula no valor padrão para separar os valores (por exemplo, `default=1;2;3`). O Gin converte isso para vírgulas internamente para que o parser de tags não fique ambíguo.
- Para `ssv` (espaço), `tsv` (tab) e `pipes` (|), use o separador natural no valor padrão.

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
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; nos valores padrão
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infere o binder pelo Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

Se você fizer um POST sem corpo, o Gin responde com os valores padrão:

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

Notas e advertências:

- Vírgulas são usadas pela sintaxe de tags de struct do Go para separar opções; evite vírgulas dentro dos valores padrão.
- Para `multi` e `csv`, ponto e vírgula separam os valores padrão; não inclua ponto e vírgula dentro dos valores padrão individuais para esses formatos.
- Valores inválidos de `collection_format` resultarão em um erro de vinculação.

Alterações relacionadas:

- Os formatos de coleção para vinculação de formulários (`multi`, `csv`, `ssv`, `tsv`, `pipes`) foram aprimorados por volta da v1.11.
- Os valores padrão para coleções foram adicionados na v1.11 (PR #4048).
