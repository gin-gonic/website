---
title: "Headers de Segurança"
sidebar:
  order: 7
---

É importante usar headers de segurança para proteger sua aplicação web de vulnerabilidades comuns de segurança. Este exemplo mostra como adicionar headers de segurança à sua aplicação Gin e também como evitar ataques relacionados à injeção de Host Header (SSRF, Open Redirection).

### O que cada header protege

| Header | Propósito |
|--------|-----------|
| `X-Content-Type-Options: nosniff` | Previne ataques de sniffing de tipo MIME. Sem esse header, navegadores podem interpretar arquivos como um tipo de conteúdo diferente do declarado, permitindo que atacantes executem scripts maliciosos disfarçados de tipos de arquivo inofensivos (ex.: enviar um `.jpg` que na verdade é JavaScript). |
| `X-Frame-Options: DENY` | Previne clickjacking desabilitando o carregamento da página dentro de um `<iframe>`. Atacantes usam clickjacking para sobrepor frames invisíveis em páginas legítimas, enganando usuários a clicar em botões ocultos (ex.: "Deletar minha conta"). |
| `Content-Security-Policy` | Controla quais recursos (scripts, estilos, imagens, fontes, etc.) o navegador pode carregar e de quais origens. Esta é uma das defesas mais eficazes contra Cross-Site Scripting (XSS) porque pode bloquear scripts inline e restringir fontes de scripts. |
| `X-XSS-Protection: 1; mode=block` | Ativa o filtro XSS integrado do navegador. Este header está amplamente depreciado em navegadores modernos (Chrome removeu seu XSS Auditor em 2019), mas ainda fornece defesa em profundidade para usuários em navegadores mais antigos. |
| `Strict-Transport-Security` | Força o navegador a usar HTTPS para todas as futuras requisições ao domínio durante o período `max-age` especificado. Isso previne ataques de downgrade de protocolo e sequestro de cookies sobre conexões HTTP inseguras. A diretiva `includeSubDomains` estende essa proteção a todos os subdomínios. |
| `Referrer-Policy: strict-origin` | Controla quanta informação de referência é enviada com requisições de saída. Sem esse header, a URL completa (incluindo parâmetros de query que podem conter tokens ou dados sensíveis) pode vazar para sites de terceiros. `strict-origin` envia apenas a origem (domínio) e apenas sobre HTTPS. |
| `Permissions-Policy` | Restringe quais recursos do navegador (geolocalização, câmera, microfone, etc.) podem ser usados pela página. Isso limita o dano se um atacante conseguir injetar scripts, já que esses scripts não podem acessar APIs sensíveis do dispositivo. |

### Exemplo

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // Setup Security Headers
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // listen and serve on 0.0.0.0:8080
}
```

Você pode testar via `curl`:

```bash
// Check Headers

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Check Host Header Injection

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

Opcionalmente, use [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // Use default security headers
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
