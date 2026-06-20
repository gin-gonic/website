---
title: "Middleware Customizado"
sidebar:
  order: 3
---

Middleware no Gin é uma função que retorna um `gin.HandlerFunc`. O middleware executa antes e/ou depois do handler principal, o que o torna útil para logging, autenticação, tratamento de erros e outras preocupações transversais.

### Fluxo de execução do middleware

Uma função middleware tem duas fases, divididas pela chamada a `c.Next()`:

- **Antes de `c.Next()`** -- O código aqui executa antes que a requisição chegue ao handler principal. Use esta fase para tarefas de configuração como registrar o tempo de início, validar tokens ou definir valores no contexto com `c.Set()`.
- **`c.Next()`** -- Isso chama o próximo handler na cadeia (que pode ser outro middleware ou o handler final da rota). A execução pausa aqui até que todos os handlers subsequentes tenham completado.
- **Depois de `c.Next()`** -- O código aqui executa depois que o handler principal terminou. Use esta fase para limpeza, logging do status da resposta ou medição de latência.

Se você quiser interromper a cadeia completamente (por exemplo, quando a autenticação falha), chame `c.Abort()` em vez de `c.Next()`. Isso impede que quaisquer handlers restantes executem. Você pode combiná-lo com uma resposta, por exemplo `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### Teste

```bash
curl http://localhost:8080/test
```

Os logs do servidor mostrarão a latência da requisição e o código de status HTTP para cada requisição que passar pelo middleware `Logger`.

## Veja também

- [Middleware de tratamento de erros](/pt/docs/middleware/error-handling-middleware/)
- [Usando middleware](/pt/docs/middleware/using-middleware/)
