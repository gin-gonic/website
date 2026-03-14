---
title: "Cookie"
sidebar:
  order: 7
---

O Gin fornece helpers para definir e ler cookies HTTP na resposta e requisição.

### Parâmetros do `SetCookie`

A assinatura do método `c.SetCookie()` é:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| Parâmetro  | Descrição |
|------------|-----------|
| `name`     | O nome (chave) do cookie. |
| `value`    | O valor do cookie. |
| `maxAge`   | Tempo de vida em **segundos**. Defina como `-1` para deletar o cookie, ou `0` para torná-lo um cookie de sessão (deletado quando o navegador fecha). |
| `path`     | O caminho de URL para o qual o cookie é válido. Use `"/"` para torná-lo disponível em todo o site. |
| `domain`   | O domínio ao qual o cookie está associado (ex.: `"example.com"`). Use `"localhost"` durante o desenvolvimento. |
| `secure`   | Quando `true`, o cookie é enviado apenas sobre conexões **HTTPS**. **Defina como `true` em produção.** |
| `httpOnly` | Quando `true`, o cookie é inacessível ao JavaScript do lado do cliente (`document.cookie`), o que ajuda a prevenir ataques XSS. **Defina como `true` em produção.** |

:::tip[Recomendação para produção]
Para implantações em produção, defina `Secure: true`, `HttpOnly: true` e `SameSite: Strict` (ou `Lax`) para minimizar a exposição a ataques de falsificação de requisição entre sites (CSRF) e cross-site scripting (XSS).
:::

### Definir e obter um cookie

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {

  router := gin.Default()

  router.GET("/cookie", func(c *gin.Context) {

    cookie, err := c.Cookie("gin_cookie")

    if err != nil {
      cookie = "NotSet"
      c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
    }

    fmt.Printf("Cookie value: %s \n", cookie)
  })

  router.Run()
}
```

### Teste

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### Deletar um cookie

Delete um cookie definindo max age como `-1`.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### Definir cookie via http.Cookie (v1.11+)

O Gin também suporta definir cookies usando um `*http.Cookie`, dando acesso a campos como `Expires`, `MaxAge`, `SameSite` e `Partitioned`.

```go
import (
  "net/http"
  "time"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/set-cookie", func(c *gin.Context) {
    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })
    c.String(http.StatusOK, "ok")
  })
  r.Run(":8080")
}
```

## Veja também

- [Headers de segurança](/pt/docs/middleware/security-headers/)
