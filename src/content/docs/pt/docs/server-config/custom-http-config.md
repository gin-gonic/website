---
title: "Configuração HTTP customizada"
sidebar:
  order: 1
---

Por padrão, `router.Run()` inicia um servidor HTTP básico. Para uso em produção, você pode precisar customizar timeouts, limites de headers ou configurações TLS. Você pode fazer isso criando seu próprio `http.Server` e passando o router do Gin como o `Handler`.

## Uso básico

Passe o router do Gin diretamente para `http.ListenAndServe`:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  http.ListenAndServe(":8080", router)
}
```

## Com configurações de servidor customizadas

Crie uma struct `http.Server` para configurar timeouts de leitura/escrita e outras opções:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(http.StatusOK, "pong")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

## Teste

```sh
curl http://localhost:8080/ping
# Output: pong
```

## Veja também

- [Reinício ou parada graciosa](/pt/docs/server-config/graceful-restart-or-stop/)
- [Executar múltiplos serviços](/pt/docs/server-config/run-multiple-service/)
