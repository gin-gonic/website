---
title: "Middleware"
sidebar:
  order: 6
---

Middleware no Gin oferece uma forma de processar requisições HTTP antes que elas cheguem aos handlers de rota. Uma função middleware tem a mesma assinatura de um handler de rota -- `gin.HandlerFunc` -- e tipicamente chama `c.Next()` para passar o controle ao próximo handler na cadeia.

## Como o middleware funciona

O Gin usa um **modelo cebola** para execução de middleware. Cada middleware executa em duas fases:

1. **Pré-handler** -- código antes do `c.Next()` executa antes do handler da rota.
2. **Pós-handler** -- código após o `c.Next()` executa depois que o handler da rota retorna.

Isso significa que o middleware envolve o handler como camadas de uma cebola. O primeiro middleware anexado é a camada mais externa.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // Pre-handler phase
    c.Next()

    // Post-handler phase
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## Anexando middleware

Existem três formas de anexar middleware no Gin:

```go
// 1. Global -- applies to all routes
router := gin.New()
router.Use(Logger(), Recovery())

// 2. Group -- applies to all routes in the group
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. Per-route -- applies to a single route
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

Middleware anexado em um escopo mais amplo executa primeiro. No exemplo acima, uma requisição para `GET /v1/users` executaria `Logger`, depois `Recovery`, depois `AuthRequired` e então `listUsers`.

## Nesta seção

- [**Usando middleware**](./using-middleware/) -- Anexe middleware globalmente, a grupos ou rotas individuais
- [**Middleware customizado**](./custom-middleware/) -- Escreva suas próprias funções de middleware
- [**Usando middleware BasicAuth**](./using-basicauth/) -- Autenticação HTTP Basic
- [**Goroutines dentro do middleware**](./goroutines-inside-middleware/) -- Execute tarefas em segundo plano com segurança a partir do middleware
- [**Configuração HTTP customizada**](./custom-http-config/) -- Tratamento de erros e recuperação no middleware
- [**Headers de segurança**](./security-headers/) -- Defina headers de segurança comuns
