---
title: "Gerenciamento de Sessões"
sidebar:
  order: 9
---

Sessões permitem armazenar dados específicos do usuário entre múltiplas requisições HTTP. Como HTTP é stateless, sessões usam cookies ou outros mecanismos para identificar usuários que retornam e recuperar seus dados armazenados.

## Usando gin-contrib/sessions

O middleware [gin-contrib/sessions](https://github.com/gin-contrib/sessions) fornece gerenciamento de sessões com múltiplos backends de armazenamento:

```sh
go get github.com/gin-contrib/sessions
```

### Sessões baseadas em cookie

A abordagem mais simples armazena dados de sessão em cookies criptografados:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Create cookie-based session store with a secret key
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### Sessões baseadas em Redis

Para aplicações em produção, armazene sessões no Redis para escalabilidade entre múltiplas instâncias:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Connect to Redis for session storage
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## Opções de sessão

Configure o comportamento da sessão com `sessions.Options`:

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // Session expires in 1 hour (seconds)
  HttpOnly: true,        // Prevent JavaScript access
  Secure:   true,        // Only send over HTTPS
  SameSite: http.SameSiteLaxMode,
})
```

| Opção | Descrição |
|-------|-----------|
| `Path` | Escopo do caminho do cookie (padrão: `/`) |
| `MaxAge` | Tempo de vida em segundos. Use `-1` para deletar, `0` para sessão do navegador |
| `HttpOnly` | Previne acesso JavaScript ao cookie |
| `Secure` | Envia cookie apenas sobre HTTPS |
| `SameSite` | Controla comportamento de cookie cross-site (`Lax`, `Strict`, `None`) |

:::note
Sempre defina `HttpOnly: true` e `Secure: true` em produção para proteger cookies de sessão de ataques XSS e man-in-the-middle.
:::

## Backends disponíveis

| Backend | Pacote | Caso de uso |
|---------|--------|-------------|
| Cookie | `sessions/cookie` | Apps simples, dados de sessão pequenos |
| Redis | `sessions/redis` | Produção, implantações multi-instância |
| Memcached | `sessions/memcached` | Camada de cache de alto desempenho |
| MongoDB | `sessions/mongo` | Quando MongoDB é seu datastore principal |
| PostgreSQL | `sessions/postgres` | Quando PostgreSQL é seu datastore principal |

## Sessões vs JWT

| Aspecto | Sessões | JWT |
|---------|---------|-----|
| Armazenamento | Lado do servidor (Redis, BD) | Lado do cliente (token) |
| Revogação | Fácil (deletar do store) | Difícil (requer blocklist) |
| Escalabilidade | Necessita store compartilhado | Stateless |
| Tamanho dos dados | Ilimitado no servidor | Limitado pelo tamanho do token |

Use sessões quando precisar de revogação fácil (ex.: logout, banir usuário). Use JWT quando precisar de autenticação stateless entre microsserviços.

## Veja também

- [Manipulação de cookies](/pt/docs/server-config/cookie/)
- [Melhores práticas de segurança](/pt/docs/middleware/security-guide/)
- [Usando middleware](/pt/docs/middleware/using-middleware/)
