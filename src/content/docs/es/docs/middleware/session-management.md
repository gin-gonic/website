---
title: "Gestión de sesiones"
sidebar:
  order: 9
---

Las sesiones permiten almacenar datos específicos del usuario a través de múltiples solicitudes HTTP. Dado que HTTP es sin estado, las sesiones usan cookies u otros mecanismos para identificar usuarios recurrentes y recuperar sus datos almacenados.

## Usando gin-contrib/sessions

El middleware [gin-contrib/sessions](https://github.com/gin-contrib/sessions) proporciona gestión de sesiones con múltiples backends de almacenamiento:

```sh
go get github.com/gin-contrib/sessions
```

### Sesiones basadas en cookies

El enfoque más simple almacena datos de sesión en cookies cifradas:

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

### Sesiones basadas en Redis

Para aplicaciones en producción, almacena sesiones en Redis para escalabilidad entre múltiples instancias:

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

## Opciones de sesión

Configura el comportamiento de las sesiones con `sessions.Options`:

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

| Opción | Descripción |
|--------|-------------|
| `Path` | Alcance de la ruta de la cookie (predeterminado: `/`) |
| `MaxAge` | Tiempo de vida en segundos. Usa `-1` para eliminar, `0` para sesión de navegador |
| `HttpOnly` | Previene el acceso JavaScript a la cookie |
| `Secure` | Solo envía la cookie sobre HTTPS |
| `SameSite` | Controla el comportamiento de cookies entre sitios (`Lax`, `Strict`, `None`) |

:::note
Siempre configura `HttpOnly: true` y `Secure: true` en producción para proteger las cookies de sesión de ataques XSS y de intermediario.
:::

## Backends disponibles

| Backend | Paquete | Caso de uso |
|---------|---------|----------|
| Cookie | `sessions/cookie` | Apps simples, datos de sesión pequeños |
| Redis | `sessions/redis` | Producción, despliegues multi-instancia |
| Memcached | `sessions/memcached` | Capa de caché de alto rendimiento |
| MongoDB | `sessions/mongo` | Cuando MongoDB es tu almacén de datos principal |
| PostgreSQL | `sessions/postgres` | Cuando PostgreSQL es tu almacén de datos principal |

## Sesiones vs JWT

| Aspecto | Sesiones | JWT |
|--------|----------|-----|
| Almacenamiento | Lado del servidor (Redis, BD) | Lado del cliente (token) |
| Revocación | Fácil (eliminar del almacén) | Difícil (requiere lista de bloqueo) |
| Escalabilidad | Necesita almacén compartido | Sin estado |
| Tamaño de datos | Ilimitado del lado del servidor | Limitado por el tamaño del token |

Usa sesiones cuando necesites revocación fácil (ej. logout, banear usuario). Usa JWT cuando necesites autenticación sin estado entre microservicios.

## Ver también

- [Manejo de cookies](/es/docs/server-config/cookie/)
- [Mejores prácticas de seguridad](/es/docs/middleware/security-guide/)
- [Usar middleware](/es/docs/middleware/using-middleware/)
