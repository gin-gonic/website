---
title: "Renderização XML/JSON/YAML/ProtoBuf"
sidebar:
  order: 1
---

O Gin oferece suporte integrado para renderizar respostas em múltiplos formatos, incluindo JSON, XML, YAML e Protocol Buffers. Isso torna simples construir APIs que suportam negociação de conteúdo -- servindo dados no formato que o cliente solicitar.

**Quando usar cada formato:**

- **JSON** -- A escolha mais comum para APIs REST e clientes baseados em navegador. Use `c.JSON()` para saída padrão ou `c.IndentedJSON()` para formatação legível durante o desenvolvimento.
- **XML** -- Útil ao integrar com sistemas legados, serviços SOAP ou clientes que esperam XML (como algumas aplicações empresariais).
- **YAML** -- Uma boa opção para endpoints orientados a configuração ou ferramentas que consomem YAML nativamente (como Kubernetes ou pipelines de CI/CD).
- **ProtoBuf** -- Ideal para comunicação de alto desempenho e baixa latência entre serviços. Protocol Buffers produzem payloads menores e serialização mais rápida comparado a formatos baseados em texto, mas requerem uma definição de schema compartilhada (arquivo `.proto`).

Todos os métodos de renderização aceitam um código de status HTTP e um valor de dados. O Gin serializa os dados e define o header `Content-Type` apropriado automaticamente.

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

## Veja também

- [PureJSON](/pt/docs/rendering/pure-json/)
- [SecureJSON](/pt/docs/rendering/secure-json/)
- [AsciiJSON](/pt/docs/rendering/ascii-json/)
- [JSONP](/pt/docs/rendering/jsonp/)
