---
title: "Formulário Multipart/Urlencoded"
sidebar:
  order: 4
---

Use `c.PostForm()` e `c.DefaultPostForm()` para ler valores de envios de formulário. Esses métodos funcionam tanto com os tipos de conteúdo `application/x-www-form-urlencoded` quanto `multipart/form-data` -- as duas formas padrão que os navegadores enviam dados de formulário.

- `c.PostForm("field")` retorna o valor ou uma string vazia se o campo estiver ausente.
- `c.DefaultPostForm("field", "fallback")` retorna o valor ou o padrão especificado se o campo estiver ausente.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

## Teste

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Missing nick -- falls back to default "anonymous"
curl -X POST http://localhost:8080/form_post \
  -d "message=hello"
# Output: {"message":"hello","nick":"anonymous","status":"posted"}
```

## Veja também

- [Upload de arquivos](/pt/docs/routing/upload-file/)
- [Query e formulário post](/pt/docs/routing/query-and-post-form/)
