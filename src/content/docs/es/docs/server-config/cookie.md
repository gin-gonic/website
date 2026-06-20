---
title: "Cookie"
sidebar:
  order: 7
---

Gin proporciona helpers para establecer y leer cookies HTTP en la respuesta y la solicitud.

### Parámetros de `SetCookie`

La firma del método `c.SetCookie()` es:

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| Parámetro  | Descripción |
|------------|-------------|
| `name`     | El nombre de la cookie (clave). |
| `value`    | El valor de la cookie. |
| `maxAge`   | Tiempo de vida en **segundos**. Establece `-1` para eliminar la cookie, o `0` para hacerla una cookie de sesión (eliminada cuando el navegador se cierra). |
| `path`     | La ruta URL para la que la cookie es válida. Usa `"/"` para hacerla disponible en todo el sitio. |
| `domain`   | El dominio al que la cookie está restringida (ej. `"example.com"`). Usa `"localhost"` durante el desarrollo. |
| `secure`   | Cuando es `true`, la cookie solo se envía por conexiones **HTTPS**. **Establece esto a `true` en producción.** |
| `httpOnly` | Cuando es `true`, la cookie es inaccesible para JavaScript del lado del cliente (`document.cookie`), lo que ayuda a prevenir ataques XSS. **Establece esto a `true` en producción.** |

:::tip[Recomendación para producción]
Para despliegues en producción, establece `Secure: true`, `HttpOnly: true` y `SameSite: Strict` (o `Lax`) para minimizar la exposición a ataques de falsificación de solicitud entre sitios (CSRF) y cross-site scripting (XSS).
:::

### Establecer y obtener una cookie

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

### Pruébalo

```bash
# First request -- no cookie sent, server sets one
curl -v http://localhost:8080/cookie
# Look for "Set-Cookie: gin_cookie=test" in the response headers

# Second request -- send the cookie back
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# Server logs: Cookie value: test
```

### Eliminar una cookie

Elimina una cookie estableciendo max age a `-1`.

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### Establecer cookie mediante http.Cookie (v1.11+)

Gin también soporta establecer cookies usando un `*http.Cookie`, dando acceso a campos como `Expires`, `MaxAge`, `SameSite` y `Partitioned`.

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

## Ver también

- [Encabezados de seguridad](/es/docs/middleware/security-headers/)
