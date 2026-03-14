---
title: "Preguntas frecuentes"
sidebar:
  order: 15
---

## Preguntas generales

### ¿Cómo habilito la recarga en vivo durante el desarrollo?

Usa [Air](https://github.com/air-verse/air) para recarga automática en vivo durante el desarrollo. Air vigila tus archivos y reconstruye/reinicia tu aplicación cuando se detectan cambios.

**Instalación:**

```sh
go install github.com/air-verse/air@latest
```

**Configuración:**

Crea un archivo de configuración `.air.toml` en la raíz de tu proyecto:

```sh
air init
```

Luego ejecuta `air` en el directorio de tu proyecto en lugar de `go run`:

```sh
air
```

Air vigilará tus archivos `.go` y reconstruirá/reiniciará automáticamente tu aplicación Gin ante los cambios. Consulta la [documentación de Air](https://github.com/air-verse/air) para opciones de configuración.

### ¿Cómo manejo CORS en Gin?

Usa el middleware oficial [gin-contrib/cors](https://github.com/gin-contrib/cors):

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Default CORS configuration
  r.Use(cors.Default())

  // Or customize CORS settings
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

Para una visión completa de seguridad, consulta [Mejores prácticas de seguridad](/es/docs/middleware/security-guide/).

### ¿Cómo sirvo archivos estáticos?

Usa `Static()` o `StaticFS()` para servir archivos estáticos:

```go
func main() {
  r := gin.Default()

  // Serve files from ./assets directory at /assets/*
  r.Static("/assets", "./assets")

  // Serve a single file
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Serve from embedded filesystem (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Consulta [Servir datos desde archivo](/es/docs/rendering/serving-data-from-file/) para más detalles.

### ¿Cómo manejo la subida de archivos?

Usa `FormFile()` para archivos individuales o `MultipartForm()` para múltiples archivos:

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  c.String(200, "File %s uploaded successfully", file.Filename)
})

// Multiple files upload
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }
  c.String(200, "%d files uploaded", len(files))
})
```

Consulta la documentación de [Subir archivos](/es/docs/routing/upload-file/) para más detalles.

### ¿Cómo implemento autenticación con JWT?

Usa [gin-contrib/jwt](https://github.com/gin-contrib/jwt) o implementa un middleware personalizado. Aquí hay un ejemplo mínimo:

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization token"})
      c.Abort()
      return
    }

    // Remove "Bearer " prefix if present
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    }
  }
}
```

Para autenticación basada en sesiones, consulta [Gestión de sesiones](/es/docs/middleware/session-management/).

### ¿Cómo configuro el logging de solicitudes?

Gin incluye un middleware de logger predeterminado a través de `gin.Default()`. Para logging JSON estructurado en producción, consulta [Logging estructurado](/es/docs/logging/structured-logging/).

Para personalización básica del log:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

Consulta la sección de [Logging](/es/docs/logging/) para todas las opciones incluyendo formatos personalizados, salida a archivo y omisión de cadenas de consulta.

### ¿Cómo manejo la parada elegante?

Consulta [Reinicio o parada elegante](/es/docs/server-config/graceful-restart-or-stop/) para una guía completa con ejemplos de código.

### ¿Por qué obtengo "404 Not Found" en lugar de "405 Method Not Allowed"?

Por defecto, Gin devuelve 404 para rutas que no soportan el método HTTP solicitado. Establece `HandleMethodNotAllowed = true` para devolver 405 en su lugar:

```go
r := gin.Default()
r.HandleMethodNotAllowed = true

r.GET("/ping", func(c *gin.Context) {
  c.JSON(200, gin.H{"message": "pong"})
})

r.Run()
```

```sh
$ curl -X POST localhost:8080/ping

HTTP/1.1 405 Method Not Allowed
Allow: GET
```

### ¿Cómo enlazo parámetros de consulta y datos POST juntos?

Usa `ShouldBind()` que selecciona automáticamente el enlace según el tipo de contenido:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Consulta la sección de [Enlace de datos](/es/docs/binding/) para todas las opciones de enlace.

### ¿Cómo valido los datos de la solicitud?

Gin usa [go-playground/validator](https://github.com/go-playground/validator) para la validación. Agrega etiquetas de validación a tus structs:

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

Consulta [Enlace y validación](/es/docs/binding/binding-and-validation/) para validadores personalizados y uso avanzado.

### ¿Cómo ejecuto Gin en modo producción?

Establece la variable de entorno `GIN_MODE` a `release`:

```sh
export GIN_MODE=release
# o
GIN_MODE=release ./your-app
```

O establécelo programáticamente:

```go
gin.SetMode(gin.ReleaseMode)
```

El modo release deshabilita el logging de depuración y mejora el rendimiento.

### ¿Cómo manejo las conexiones de base de datos con Gin?

Consulta [Integración con base de datos](/es/docs/server-config/database/) para una guía completa cubriendo `database/sql`, GORM, pool de conexiones y patrones de inyección de dependencias.

### ¿Cómo pruebo los handlers de Gin?

Usa `net/http/httptest` para probar tus rutas:

```go
func TestPingRoute(t *testing.T) {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

Consulta la documentación de [Pruebas](/es/docs/testing/) para más ejemplos.

## Preguntas de rendimiento

### ¿Cómo optimizo Gin para alto tráfico?

1. **Usa el modo Release**: Establece `GIN_MODE=release`
2. **Deshabilita middleware innecesario**: Solo usa lo que necesitas
3. **Usa `gin.New()` en lugar de `gin.Default()`** para control manual del middleware
4. **Pool de conexiones**: Configura pools de conexiones de base de datos (consulta [Integración con base de datos](/es/docs/server-config/database/))
5. **Caché**: Implementa caché para datos accedidos frecuentemente
6. **Balanceo de carga**: Usa proxy inverso (nginx, HAProxy)
7. **Profiling**: Usa el pprof de Go para identificar cuellos de botella
8. **Monitoreo**: Configura [métricas y monitoreo](/es/docs/server-config/metrics/) para rastrear el rendimiento

### ¿Gin está listo para producción?

Sí. Gin es usado en producción por muchas empresas y ha sido probado en batalla a escala. Consulta [Usuarios](/es/docs/users/) para ejemplos de proyectos usando Gin en producción.

## Resolución de problemas

### ¿Por qué mis parámetros de ruta no funcionan?

Asegúrate de que los parámetros de ruta usen la sintaxis `:` y se extraigan correctamente:

```go
// Correcto
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// No: /user/{id} o /user/<id>
```

Consulta [Parámetros en la ruta](/es/docs/routing/param-in-path/) para detalles.

### ¿Por qué mi middleware no se ejecuta?

El middleware debe registrarse antes de las rutas o grupos de rutas:

```go
// Orden correcto
r := gin.New()
r.Use(MyMiddleware()) // Registrar middleware primero
r.GET("/ping", handler) // Luego las rutas

// Para grupos de rutas
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware para este grupo
{
  auth.GET("/dashboard", handler)
}
```

Consulta [Usar middleware](/es/docs/middleware/using-middleware/) para detalles.

### ¿Por qué falla el enlace de la solicitud?

Razones comunes:

1. **Etiquetas de enlace faltantes**: Agrega etiquetas `json:"field"` o `form:"field"`
2. **Content-Type no coincide**: Asegúrate de que el cliente envíe el encabezado Content-Type correcto
3. **Errores de validación**: Verifica las etiquetas de validación y requisitos
4. **Campos no exportados**: Solo los campos de struct exportados (con mayúscula inicial) se enlazan

```go
type User struct {
  Name  string `json:"name" binding:"required"` // Correcto
  Email string `json:"email"`                    // Correcto
  age   int    `json:"age"`                      // No se enlazará (no exportado)
}
```

Consulta [Enlace y validación](/es/docs/binding/binding-and-validation/) para detalles.
