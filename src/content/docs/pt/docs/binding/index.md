---
title: "Binding"
sidebar:
  order: 4
---

O Gin fornece um poderoso sistema de binding que analisa dados da requisição em structs Go e os valida automaticamente. Em vez de chamar manualmente `c.PostForm()` ou ler `c.Request.Body`, você define uma struct com tags e deixa o Gin fazer o trabalho.

## Bind vs ShouldBind

O Gin oferece duas famílias de métodos de binding:

| Método | Em caso de erro | Use quando |
|--------|----------------|------------|
| `c.Bind`, `c.BindJSON`, etc. | Chama `c.AbortWithError(400, err)` automaticamente | Você quer que o Gin trate as respostas de erro |
| `c.ShouldBind`, `c.ShouldBindJSON`, etc. | Retorna o erro para você tratar | Você quer respostas de erro personalizadas |

Na maioria dos casos, **prefira `ShouldBind`** para ter mais controle sobre o tratamento de erros.

## Exemplo rápido

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## Formatos suportados

O Gin pode vincular dados de diversas fontes: **JSON**, **XML**, **YAML**, **TOML**, **dados de formulário** (URL-encoded e multipart), **query strings**, **parâmetros de URI** e **headers**. Use a tag de struct apropriada (`json`, `xml`, `yaml`, `form`, `uri`, `header`) para mapear campos. As regras de validação vão na tag `binding` e utilizam a sintaxe do [go-playground/validator](https://github.com/go-playground/validator).

## Nesta seção

- [**Model binding e validação**](./binding-and-validation/) -- Conceitos básicos de binding e regras de validação
- [**Validadores customizados**](./custom-validators/) -- Registre suas próprias funções de validação
- [**Vincular query string ou dados post**](./bind-query-or-post/) -- Vincule a partir de query strings e corpos de formulário
- [**Bind URI**](./bind-uri/) -- Vincule parâmetros de caminho em structs
- [**Bind header**](./bind-header/) -- Vincule headers HTTP em structs
- [**Valor padrão**](./default-value/) -- Defina valores de fallback para campos ausentes
- [**Formato de coleção**](./collection-format/) -- Gerencie parâmetros de array em query
- [**Unmarshaler customizado**](./custom-unmarshaler/) -- Implemente lógica de deserialização personalizada
- [**Bind checkboxes HTML**](./bind-html-checkboxes/) -- Gerencie inputs de checkbox de formulários
- [**Binding multipart/urlencoded**](./multipart-urlencoded-binding/) -- Vincule dados de formulários multipart
- [**Tag de struct customizada**](./custom-struct-tag/) -- Use tags de struct personalizadas para mapeamento de campos
- [**Vincular body em structs diferentes**](./bind-body-into-different-structs/) -- Analise o corpo da requisição mais de uma vez
