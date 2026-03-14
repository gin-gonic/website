---
title: "Renderização"
sidebar:
  order: 5
---

O Gin suporta renderização de respostas em múltiplos formatos incluindo JSON, XML, YAML, ProtoBuf, HTML e mais. Todo método de renderização segue o mesmo padrão: chame um método no `*gin.Context` com um código de status HTTP e os dados a serem serializados. O Gin cuida dos headers de content-type, serialização e escrita da resposta automaticamente.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

Você pode usar o header `Accept` ou um parâmetro de query para servir os mesmos dados em múltiplos formatos a partir de um único handler:

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

## Nesta seção

- [**Renderização XML/JSON/YAML/ProtoBuf**](./rendering/) -- Renderize respostas em múltiplos formatos com tratamento automático de content-type
- [**SecureJSON**](./secure-json/) -- Previna ataques de sequestro de JSON em navegadores antigos
- [**JSONP**](./jsonp/) -- Suporte a requisições cross-domain de clientes antigos sem CORS
- [**AsciiJSON**](./ascii-json/) -- Escape caracteres não-ASCII para transporte seguro
- [**PureJSON**](./pure-json/) -- Renderize JSON sem escapar caracteres HTML
- [**Servindo arquivos estáticos**](./serving-static-files/) -- Sirva diretórios de assets estáticos
- [**Servindo dados de arquivo**](./serving-data-from-file/) -- Sirva arquivos individuais, anexos e downloads
- [**Servindo dados de reader**](./serving-data-from-reader/) -- Faça streaming de dados de qualquer `io.Reader` para a resposta
- [**Renderização HTML**](./html-rendering/) -- Renderize templates HTML com dados dinâmicos
- [**Múltiplos templates**](./multiple-template/) -- Use múltiplos conjuntos de templates em uma única aplicação
- [**Vincular binário único com template**](./bind-single-binary-with-template/) -- Incorpore templates no seu binário compilado
