---
title: "Melhores Práticas de Segurança"
sidebar:
  order: 8
---

Aplicações web são um alvo primário para atacantes. Uma aplicação Gin que lida com entrada de usuário, armazena dados ou roda atrás de um proxy reverso precisa de configuração de segurança deliberada antes de ir para produção. Este guia cobre as defesas mais importantes e mostra como aplicar cada uma com middleware Gin e bibliotecas padrão do Go.

:::note
Segurança é em camadas. Nenhuma técnica isolada nesta lista é suficiente por si só. Aplique todas as seções relevantes para construir defesa em profundidade.
:::

## Configuração CORS

Cross-Origin Resource Sharing (CORS) controla quais domínios externos podem fazer requisições à sua API. CORS mal configurado pode permitir que sites maliciosos leiam respostas do seu servidor em nome de usuários autenticados.

Use o pacote [`gin-contrib/cors`](https://github.com/gin-contrib/cors) para uma solução bem testada.

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
Nunca use `AllowOrigins: []string{"*"}` junto com `AllowCredentials: true`. Isso diz aos navegadores que qualquer site pode fazer requisições autenticadas à sua API.
:::

## Proteção CSRF

Cross-Site Request Forgery engana o navegador de um usuário autenticado para enviar requisições indesejadas à sua aplicação. Qualquer endpoint que altera estado (POST, PUT, DELETE) e depende de cookies para autenticação precisa de proteção CSRF.

Use o middleware [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) para adicionar proteção baseada em token.

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
A proteção CSRF é crítica para aplicações que usam autenticação baseada em cookies. APIs que dependem exclusivamente de headers `Authorization` (ex.: Bearer tokens) não são vulneráveis a CSRF porque os navegadores não anexam esses headers automaticamente.
:::

## Rate limiting

Rate limiting previne abuso, ataques de força bruta e exaustão de recursos. Você pode usar o pacote `golang.org/x/time/rate` da biblioteca padrão para construir um rate limiter simples por cliente como middleware.

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // Allow 10 requests per second with a burst of 20
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
O exemplo acima armazena limiters em um mapa em memória. Em produção, você deve adicionar limpeza periódica de entradas obsoletas e considerar um rate limiter distribuído (ex.: baseado em Redis) se você executa múltiplas instâncias da aplicação.
:::

## Validação de entrada e prevenção de injeção SQL

Sempre valide e vincule entradas usando o model binding do Gin com tags de struct. Nunca construa queries SQL concatenando entrada do usuário.

### Valide entrada com tags de struct

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // req is now validated; proceed safely
}
```

### Use queries parametrizadas

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

Isso se aplica a toda biblioteca de banco de dados. Seja usando `database/sql`, GORM, sqlx ou outro ORM, sempre use placeholders de parâmetros e nunca concatenação de strings.

:::note
Validação de entrada e queries parametrizadas são suas duas defesas mais importantes contra ataques de injeção. Nenhuma delas sozinha é suficiente -- use ambas.
:::

## Prevenção de XSS

Cross-Site Scripting (XSS) ocorre quando um atacante injeta scripts maliciosos que executam nos navegadores de outros usuários. Defenda-se contra isso em múltiplas camadas.

### Escape de saída HTML

Ao renderizar templates HTML, o pacote `html/template` do Go escapa a saída por padrão. Se você retorna dados fornecidos pelo usuário como JSON, certifique-se de que o header `Content-Type` esteja definido corretamente para que os navegadores não interpretem JSON como HTML.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### Use SecureJSON para proteção JSONP

O Gin fornece `c.SecureJSON` que prepende `while(1);` para prevenir sequestro de JSON.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### Defina Content-Type explicitamente quando necessário

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

O header `X-Content-Type-Options: nosniff` previne que navegadores façam sniffing de tipo MIME, o que impede que interpretem uma resposta como HTML quando o servidor a declara como outro tipo.

## Middleware de headers de segurança

Adicionar headers de segurança é uma das etapas de hardening mais simples e eficazes. Veja a página completa [Headers de Segurança](/pt/docs/middleware/security-headers/) para um exemplo detalhado. Abaixo está um resumo rápido dos headers essenciais.

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| Header | O que previne |
|--------|--------------|
| `X-Frame-Options: DENY` | Clickjacking via iframes |
| `X-Content-Type-Options: nosniff` | Ataques de sniffing de tipo MIME |
| `Strict-Transport-Security` | Downgrade de protocolo e sequestro de cookies |
| `Content-Security-Policy` | XSS e injeção de dados |
| `Referrer-Policy` | Vazamento de parâmetros sensíveis de URL para terceiros |
| `Permissions-Policy` | Uso não autorizado de APIs do navegador (câmera, mic, etc.) |

## Proxies confiáveis

Quando sua aplicação roda atrás de um proxy reverso ou load balancer, você deve informar ao Gin quais proxies são confiáveis. Sem essa configuração, atacantes podem forjar o header `X-Forwarded-For` para contornar controles de acesso baseados em IP e rate limiting.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

Veja a página [Proxies Confiáveis](/pt/docs/server-config/trusted-proxies/) para uma explicação completa e opções de configuração.

## HTTPS e TLS

Todas as aplicações Gin em produção devem servir tráfego sobre HTTPS. O Gin suporta certificados TLS automáticos via Let's Encrypt.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

Veja a página [Suporte ao Let's Encrypt](/pt/docs/server-config/support-lets-encrypt/) para instruções completas de configuração incluindo gerenciadores de certificado customizados.

:::note
Sempre combine HTTPS com o header `Strict-Transport-Security` (HSTS) para prevenir ataques de downgrade de protocolo. Uma vez que o header HSTS está definido, os navegadores recusarão conectar via HTTP simples.
:::

## Veja também

- [Headers de Segurança](/pt/docs/middleware/security-headers/)
- [Proxies Confiáveis](/pt/docs/server-config/trusted-proxies/)
- [Suporte ao Let's Encrypt](/pt/docs/server-config/support-lets-encrypt/)
- [Middleware Customizado](/pt/docs/middleware/custom-middleware/)
- [Binding e Validação](/pt/docs/binding/binding-and-validation/)
