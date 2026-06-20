---
title: "Mejores prácticas de seguridad"
sidebar:
  order: 8
---

Las aplicaciones web son un objetivo principal para los atacantes. Una aplicación Gin que maneja entrada del usuario, almacena datos o se ejecuta detrás de un proxy inverso necesita una configuración de seguridad deliberada antes de ir a producción. Esta guía cubre las defensas más importantes y muestra cómo aplicar cada una con middleware de Gin y bibliotecas estándar de Go.

:::note
La seguridad funciona por capas. Ninguna técnica individual en esta lista es suficiente por sí sola. Aplica todas las secciones relevantes para construir una defensa en profundidad.
:::

## Configuración CORS

El Intercambio de Recursos de Origen Cruzado (CORS) controla qué dominios externos pueden realizar solicitudes a tu API. Un CORS mal configurado puede permitir que sitios web maliciosos lean respuestas de tu servidor en nombre de usuarios autenticados.

Usa el paquete [`gin-contrib/cors`](https://github.com/gin-contrib/cors) para una solución bien probada.

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
Nunca uses `AllowOrigins: []string{"*"}` junto con `AllowCredentials: true`. Esto le dice a los navegadores que cualquier sitio puede hacer solicitudes autenticadas a tu API.
:::

## Protección CSRF

La Falsificación de Solicitud entre Sitios engaña al navegador de un usuario autenticado para enviar solicitudes no deseadas a tu aplicación. Cualquier endpoint que cambie estado (POST, PUT, DELETE) que dependa de cookies para autenticación necesita protección CSRF.

Usa el middleware [`gin-contrib/csrf`](https://github.com/gin-contrib/csrf) para agregar protección basada en tokens.

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
La protección CSRF es crítica para aplicaciones que usan autenticación basada en cookies. Las APIs que dependen únicamente de encabezados `Authorization` (ej. tokens Bearer) no son vulnerables a CSRF porque los navegadores no adjuntan esos encabezados automáticamente.
:::

## Limitación de tasa

La limitación de tasa previene abuso, ataques de fuerza bruta y agotamiento de recursos. Puedes usar el paquete de la biblioteca estándar `golang.org/x/time/rate` para construir un limitador de tasa simple por cliente como middleware.

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
El ejemplo anterior almacena limitadores en un mapa en memoria. En producción, deberías agregar limpieza periódica de entradas obsoletas y considerar un limitador de tasa distribuido (ej. respaldado por Redis) si ejecutas múltiples instancias de la aplicación.
:::

## Validación de entrada y prevención de inyección SQL

Siempre valida y enlaza la entrada usando el enlace de modelos de Gin con etiquetas de struct. Nunca construyas consultas SQL concatenando entrada del usuario.

### Validar entrada con etiquetas de struct

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

### Usar consultas parametrizadas

```go
// DANGEROUS -- SQL injection vulnerability
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// SAFE -- parameterized query
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

Esto aplica a cada biblioteca de base de datos. Ya sea que uses `database/sql`, GORM, sqlx u otro ORM, siempre usa marcadores de posición de parámetros y nunca concatenación de cadenas.

:::note
La validación de entrada y las consultas parametrizadas son tus dos defensas más importantes contra ataques de inyección. Ninguna por sí sola es suficiente -- usa ambas.
:::

## Prevención de XSS

Cross-Site Scripting (XSS) ocurre cuando un atacante inyecta scripts maliciosos que se ejecutan en los navegadores de otros usuarios. Defiéndete contra esto en múltiples capas.

### Escapar la salida HTML

Al renderizar plantillas HTML, el paquete `html/template` de Go escapa la salida por defecto. Si devuelves datos proporcionados por el usuario como JSON, asegúrate de que el encabezado `Content-Type` esté configurado correctamente para que los navegadores no interpreten el JSON como HTML.

```go
// Gin sets Content-Type automatically for JSON responses.
// Use c.JSON, not c.String, when returning structured data.
c.JSON(200, gin.H{"input": userInput})
```

### Usar SecureJSON para protección JSONP

Gin proporciona `c.SecureJSON` que antepone `while(1);` para prevenir el secuestro de JSON.

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### Establecer Content-Type explícitamente cuando sea necesario

```go
// For API endpoints, always return JSON
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

El encabezado `X-Content-Type-Options: nosniff` previene que los navegadores detecten el tipo MIME, lo que impide que interpreten una respuesta como HTML cuando el servidor la declara como algo diferente.

## Middleware de encabezados de seguridad

Agregar encabezados de seguridad es uno de los pasos de endurecimiento más simples y efectivos. Consulta la página completa de [Encabezados de seguridad](/es/docs/middleware/security-headers/) para un ejemplo detallado. A continuación hay un resumen rápido de los encabezados esenciales.

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

| Encabezado | Qué previene |
|--------|-----------------|
| `X-Frame-Options: DENY` | Clickjacking a través de iframes |
| `X-Content-Type-Options: nosniff` | Ataques de detección de tipo MIME |
| `Strict-Transport-Security` | Degradación de protocolo y secuestro de cookies |
| `Content-Security-Policy` | XSS e inyección de datos |
| `Referrer-Policy` | Filtración de parámetros URL sensibles a terceros |
| `Permissions-Policy` | Uso no autorizado de APIs del navegador (cámara, micrófono, etc.) |

## Proxies de confianza

Cuando tu aplicación se ejecuta detrás de un proxy inverso o balanceador de carga, debes decirle a Gin en qué proxies confiar. Sin esta configuración, los atacantes pueden falsificar el encabezado `X-Forwarded-For` para evadir controles de acceso basados en IP y limitación de tasa.

```go
// Trust only your known proxy addresses
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

Consulta la página de [Proxies de confianza](/es/docs/server-config/trusted-proxies/) para una explicación completa y opciones de configuración.

## HTTPS y TLS

Todas las aplicaciones Gin en producción deberían servir tráfico sobre HTTPS. Gin soporta certificados TLS automáticos a través de Let's Encrypt.

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... routes ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

Consulta la página de [Soporte para Let's Encrypt](/es/docs/server-config/support-lets-encrypt/) para instrucciones de configuración completas incluyendo gestores de certificados personalizados.

:::note
Siempre combina HTTPS con el encabezado `Strict-Transport-Security` (HSTS) para prevenir ataques de degradación de protocolo. Una vez que el encabezado HSTS está configurado, los navegadores se negarán a conectar por HTTP plano.
:::

## Ver también

- [Encabezados de seguridad](/es/docs/middleware/security-headers/)
- [Proxies de confianza](/es/docs/server-config/trusted-proxies/)
- [Soporte para Let's Encrypt](/es/docs/server-config/support-lets-encrypt/)
- [Middleware personalizado](/es/docs/middleware/custom-middleware/)
- [Enlace y validación](/es/docs/binding/binding-and-validation/)
