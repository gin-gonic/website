---
title: "Roteamento"
sidebar:
  order: 3
---

O Gin oferece um poderoso sistema de roteamento construído sobre o [httprouter](https://github.com/julienschmidt/httprouter) para correspondência de URLs de alto desempenho. Por baixo dos panos, o httprouter utiliza uma [árvore radix](https://en.wikipedia.org/wiki/Radix_tree) (também chamada de trie comprimida) para armazenar e buscar rotas, o que significa que a correspondência de rotas é extremamente rápida e não requer alocações de memória por consulta. Isso torna o Gin um dos frameworks web Go mais rápidos disponíveis.

As rotas são registradas chamando um método HTTP no engine (ou em um grupo de rotas) e fornecendo um padrão de URL junto com uma ou mais funções handler:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## Nesta seção

As páginas abaixo cobrem cada tópico de roteamento em detalhes:

- [**Usando métodos HTTP**](./http-method/) -- Registre rotas para GET, POST, PUT, DELETE, PATCH, HEAD e OPTIONS.
- [**Parâmetros no caminho**](./param-in-path/) -- Capture segmentos dinâmicos dos caminhos de URL (ex.: `/user/:name`).
- [**Parâmetros de querystring**](./querystring-param/) -- Leia valores de query string da URL da requisição.
- [**Query e formulário post**](./query-and-post-form/) -- Acesse tanto dados de query string quanto de formulário POST no mesmo handler.
- [**Map como querystring ou postform**](./map-as-querystring-or-postform/) -- Vincule parâmetros de map a partir de query strings ou formulários POST.
- [**Formulário multipart/urlencoded**](./multipart-urlencoded-form/) -- Analise corpos `multipart/form-data` e `application/x-www-form-urlencoded`.
- [**Upload de arquivos**](./upload-file/) -- Gerencie upload de arquivo único e múltiplos.
- [**Agrupamento de rotas**](./grouping-routes/) -- Organize rotas sob prefixos comuns com middleware compartilhado.
- [**Redirecionamentos**](./redirects/) -- Realize redirecionamentos HTTP e no nível do roteador.
