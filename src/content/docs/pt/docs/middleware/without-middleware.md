---
title: "Sem middleware por padrão"
sidebar:
  order: 1
---

O Gin oferece duas formas de criar um engine de roteamento, e a diferença está em quais middlewares são anexados por padrão.

### `gin.Default()` -- com Logger e Recovery

`gin.Default()` cria um roteador com dois middlewares já anexados:

- **Logger** -- Escreve logs de requisição para stdout (método, caminho, código de status, latência).
- **Recovery** -- Recupera de qualquer panic nos handlers e retorna uma resposta 500, prevenindo que seu servidor quebre.

Esta é a escolha mais comum para começar rapidamente.

### `gin.New()` -- um engine em branco

`gin.New()` cria um roteador completamente vazio, **sem nenhum middleware** anexado. Isso é útil quando você quer controle total sobre quais middlewares executam, por exemplo:

- Você quer usar um logger estruturado (como `slog` ou `zerolog`) em vez do logger de texto padrão.
- Você quer personalizar o comportamento de recuperação de panic.
- Você está construindo um microsserviço onde precisa de uma pilha de middleware mínima ou especializada.

### Exemplo

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // Create a blank engine with no middleware.
  r := gin.New()

  // Attach only the middleware you need.
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  log.Fatal(r.Run(":8080"))
}
```

No exemplo acima, o middleware Recovery está incluído para prevenir crashes, mas o middleware Logger padrão foi omitido. Você pode substituí-lo pelo seu próprio middleware de logging ou simplesmente não utilizá-lo.
