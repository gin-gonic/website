---
title: "Middleware de tratamento de erros"
sidebar:
  order: 4
---

Em uma aplicação RESTful típica, você pode encontrar erros em qualquer rota, como:

- Entrada inválida do usuário
- Falhas no banco de dados
- Acesso não autorizado
- Bugs internos do servidor

Por padrão, o Gin permite que você trate erros manualmente em cada rota usando `c.Error(err)`.
Mas isso pode se tornar rapidamente repetitivo e inconsistente.

Para resolver isso, podemos usar middleware customizado para tratar todos os erros em um único lugar.
Este middleware executa após cada requisição e verifica se há erros adicionados ao contexto do Gin (`c.Errors`).
Se encontrar algum, ele envia uma resposta JSON estruturada com um código de status apropriado.

#### Exemplo

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### Extensões

- Mapear erros para códigos de status
- Gerar respostas de erro diferentes baseadas em códigos de erro
- Registrar erros usando logging

#### Benefícios do Middleware de Tratamento de Erros

- **Consistência**: Todos os erros seguem o mesmo formato
- **Rotas limpas**: A lógica de negócios é separada da formatação de erros
- **Menos duplicação**: Não é necessário repetir a lógica de tratamento de erros em cada handler
