---
title: "Formulário Multipart/Urlencoded"
sidebar:
  order: 4
---

Use `c.PostForm()` e `c.DefaultPostForm()` para ler valores de envios de formulário. Esses métodos funcionam tanto com o tipo de conteúdo `application/x-www-form-urlencoded` quanto com `multipart/form-data` -- as duas formas padrão que os navegadores utilizam para enviar dados de formulário.

- `c.PostForm("field")` retorna o valor ou uma string vazia se o campo estiver ausente.
- `c.DefaultPostForm("field", "fallback")` retorna o valor ou o padrão especificado se o campo estiver ausente.

```go
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

### Teste

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
```

## Veja também

- [Upload de arquivos](/pt/docs/routing/upload-file/)
- [Query e formulário post](/pt/docs/routing/query-and-post-form/)
