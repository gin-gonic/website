---
title: "Encabezados de seguridad"
sidebar:
  order: 7
---

Es importante usar encabezados de seguridad para proteger tu aplicación web de vulnerabilidades de seguridad comunes. Este ejemplo muestra cómo agregar encabezados de seguridad a tu aplicación Gin y también cómo evitar ataques relacionados con la inyección de encabezado Host (SSRF, Redirección abierta).

### Qué protege cada encabezado

| Encabezado | Propósito |
|--------|---------|
| `X-Content-Type-Options: nosniff` | Previene ataques de detección de tipo MIME. Sin este encabezado, los navegadores pueden interpretar archivos como un tipo de contenido diferente al declarado, permitiendo a los atacantes ejecutar scripts maliciosos disfrazados como tipos de archivo inofensivos (ej. subir un `.jpg` que en realidad es JavaScript). |
| `X-Frame-Options: DENY` | Previene clickjacking al deshabilitar que la página se cargue dentro de un `<iframe>`. Los atacantes usan clickjacking para superponer marcos invisibles sobre páginas legítimas, engañando a los usuarios para que hagan clic en botones ocultos (ej. "Eliminar mi cuenta"). |
| `Content-Security-Policy` | Controla qué recursos (scripts, estilos, imágenes, fuentes, etc.) el navegador puede cargar y desde qué orígenes. Esta es una de las defensas más efectivas contra Cross-Site Scripting (XSS) porque puede bloquear scripts en línea y restringir fuentes de scripts. |
| `X-XSS-Protection: 1; mode=block` | Activa el filtro XSS integrado del navegador. Este encabezado está en gran medida obsoleto en navegadores modernos (Chrome eliminó su XSS Auditor en 2019), pero aún proporciona defensa en profundidad para usuarios en navegadores más antiguos. |
| `Strict-Transport-Security` | Obliga al navegador a usar HTTPS para todas las futuras solicitudes al dominio durante la duración especificada en `max-age`. Esto previene ataques de degradación de protocolo y secuestro de cookies sobre conexiones HTTP inseguras. La directiva `includeSubDomains` extiende esta protección a todos los subdominios. |
| `Referrer-Policy: strict-origin` | Controla cuánta información de referencia se envía con solicitudes salientes. Sin este encabezado, la URL completa (incluyendo parámetros de consulta que pueden contener tokens o datos sensibles) puede filtrarse a sitios de terceros. `strict-origin` envía solo el origen (dominio) y solo sobre HTTPS. |
| `Permissions-Policy` | Restringe qué funciones del navegador (geolocalización, cámara, micrófono, etc.) pueden ser usadas por la página. Esto limita el daño si un atacante logra inyectar scripts, ya que esos scripts no pueden acceder a APIs sensibles del dispositivo. |

### Ejemplo

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

Puedes probarlo con `curl`:

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

Opcionalmente, usa [gin helmet](https://github.com/danielkov/gin-helmet) `go get github.com/danielkov/gin-helmet/ginhelmet`

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
