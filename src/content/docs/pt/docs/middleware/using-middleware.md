---
title: "Usando middleware"
sidebar:
  order: 2
---

Middleware no Gin são funções que executam antes (e opcionalmente depois) do seu handler de rota. São usados para preocupações transversais como logging, autenticação, recuperação de erros e modificação de requisições.

O Gin suporta três níveis de anexação de middleware:

- **Middleware global** -- Aplicado a todas as rotas no roteador. Registrado com `router.Use()`. Bom para preocupações como logging e recuperação de panic que se aplicam universalmente.
- **Middleware de grupo** -- Aplicado a todas as rotas dentro de um grupo de rotas. Registrado com `group.Use()`. Útil para aplicar autenticação ou autorização a um subconjunto de rotas (ex.: todas as rotas `/admin/*`).
- **Middleware por rota** -- Aplicado a uma única rota apenas. Passado como argumentos adicionais para `router.GET()`, `router.POST()`, etc. Útil para lógica específica de rota como rate limiting customizado ou validação de entrada.

**Ordem de execução:** As funções middleware executam na ordem em que são registradas. A chamada a `c.Next()` executa os handlers restantes e, quando retorna, retoma a execução do middleware atual. Isso permite executar código antes e depois dos handlers seguintes; quando os middlewares envolvem os handlers seguintes dessa forma, seu pós-processamento executa em ordem inversa (LIFO).

Se um middleware retorna sem chamar `c.Next()`, os middlewares seguintes e o handler continuam sendo executados, a menos que o contexto tenha sido abortado. Para pular os handlers pendentes, chame `c.Abort()` ou um método `AbortWithStatus*`. Abortar não interrompe a função middleware atual, portanto use `return` se também quiser interromper a execução do código restante dessa função.

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()` é uma função de conveniência que cria um roteador com os middlewares `Logger` e `Recovery` já anexados. Se você quer um roteador limpo sem nenhum middleware, use `gin.New()` como mostrado acima e adicione apenas os middlewares que precisar.
:::
