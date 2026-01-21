---
title: "FAQ"
sidebar:
  order: 9
---

## Preguntas Generales

### ¿Cómo habilito la recarga en vivo durante el desarrollo?

Usa [Air](https://github.com/air-verse/air) para la recarga automática en vivo durante el desarrollo. Air observa tus archivos y reconstruye/reinicia tu aplicación cuando se detectan cambios.

**Instalación:**

```sh
# Instalar Air globalmente
go install github.com/air-verse/air@latest
```

**Configuración:**

Crea un archivo de configuración `.air.toml` en la raíz de tu proyecto:

```sh
air init
```

Esto genera una configuración predeterminada. Puedes personalizarla para tu proyecto Gin:

```toml
# .air.toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

**Uso:**

Simplemente ejecuta `air` en el directorio de tu proyecto en lugar de `go run`:

```sh
air
```

Air ahora observará tus archivos `.go` y reconstruirá/reiniciará automáticamente tu aplicación Gin en los cambios.

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

  // Configuración CORS predeterminada
  r.Use(cors.Default())

  // O personaliza la configuración CORS
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

### ¿Cómo sirvo archivos estáticos?

Usa `Static()` o `StaticFS()` para servir archivos estáticos:

```go
func main() {
  r := gin.Default()

  // Servir archivos del directorio ./assets en /assets/*
  r.Static("/assets", "./assets")

  // Servir un solo archivo
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Servir desde sistema de archivos embebido (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Consulta el [ejemplo de servir archivos estáticos](../examples/serving-static-files/) para más detalles.

### ¿Cómo manejo la carga de archivos?

Usa `FormFile()` para archivos individuales o `MultipartForm()` para múltiples archivos:

```go
// Carga de archivo individual
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // Guardar el archivo
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "Archivo %s subido exitosamente", file.Filename)
})

// Carga de múltiples archivos
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d archivos subidos", len(files))
})
```

Consulta los [ejemplos de carga de archivos](../examples/upload-file/) para más detalles.

### ¿Cómo implemento autenticación con JWT?

Usa [gin-contrib/jwt](https://github.com/gin-contrib/jwt) o implementa un middleware personalizado:

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

func GenerateToken(username string) (string, error) {
  claims := Claims{
    Username: username,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Falta el token de autorización"})
      c.Abort()
      return
    }

    // Eliminar prefijo "Bearer " si está presente
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Claims de token inválidos"})
      c.Abort()
    }
  }
}

func main() {
  r := gin.Default()

  r.POST("/login", func(c *gin.Context) {
    var credentials struct {
      Username string `json:"username"`
      Password string `json:"password"`
    }

    if err := c.BindJSON(&credentials); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    // Validar credenciales (implementa tu propia lógica)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
    }
  })

  // Rutas protegidas
  authorized := r.Group("/")
  authorized.Use(AuthMiddleware())
  {
    authorized.GET("/profile", func(c *gin.Context) {
      username := c.MustGet("username").(string)
      c.JSON(http.StatusOK, gin.H{"username": username})
    })
  }

  r.Run()
}
```

### ¿Cómo configuro el registro de solicitudes?

Gin incluye un middleware de registro predeterminado. Personalízalo o usa registro estructurado:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// Middleware de registro personalizado
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path

    c.Next()

    latency := time.Since(start)
    statusCode := c.Writer.Status()
    clientIP := c.ClientIP()
    method := c.Request.Method

    log.Printf("[GIN] %s | %3d | %13v | %15s | %-7s %s",
      time.Now().Format("2006/01/02 - 15:04:05"),
      statusCode,
      latency,
      clientIP,
      method,
      path,
    )
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

Para registro más avanzado, consulta el [ejemplo de formato de registro personalizado](../examples/custom-log-format/).

### ¿Cómo manejo el apagado graceful?

Implementa el apagado graceful para cerrar las conexiones correctamente:

```go
package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "¡Bienvenido!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // Ejecutar servidor en una goroutine
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("escuchar: %s\n", err)
    }
  }()

  // Esperar señal de interrupción para apagar el servidor gracefully
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Apagando servidor...")

  // Dar a las solicitudes pendientes 5 segundos para completar
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Servidor forzado a apagar:", err)
  }

  log.Println("Servidor terminado")
}
```

Consulta el [ejemplo de reinicio o detención graceful](../examples/graceful-restart-or-stop/) para más detalles.

### ¿Por qué obtengo "404 Not Found" en lugar de "405 Method Not Allowed"?

Por defecto, Gin devuelve 404 para rutas que no soportan el método HTTP solicitado. Para devolver 405 Method Not Allowed, habilita la opción `HandleMethodNotAllowed`.

Consulta [FAQ de Method Not Allowed](./method-not-allowed/) para más detalles.

### ¿Cómo vinculo parámetros de consulta y datos POST juntos?

Usa `ShouldBind()` que selecciona automáticamente el binding basado en el tipo de contenido:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // Vincula parámetros de consulta y cuerpo de solicitud (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Para más control, consulta el [ejemplo de vincular consulta o post](../examples/bind-query-or-post/).

### ¿Cómo valido los datos de la solicitud?

Gin usa [go-playground/validator](https://github.com/go-playground/validator) para validación. Agrega etiquetas de validación a tus estructuras:

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
  c.JSON(200, gin.H{"message": "Usuario válido"})
})
```

Para validadores personalizados, consulta el [ejemplo de validadores personalizados](../examples/custom-validators/).

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

El modo release:

- Deshabilita el registro de depuración
- Mejora el rendimiento
- Reduce ligeramente el tamaño del binario

### ¿Cómo manejo las conexiones de base de datos con Gin?

Usa inyección de dependencias o contexto para compartir conexiones de base de datos:

```go
package main

import (
  "database/sql"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // Método 1: Pasar db a los handlers
  r.GET("/users", func(c *gin.Context) {
    var users []string
    rows, _ := db.Query("SELECT name FROM users")
    defer rows.Close()

    for rows.Next() {
      var name string
      rows.Scan(&name)
      users = append(users, name)
    }

    c.JSON(200, users)
  })

  // Método 2: Usar middleware para inyectar db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

Para ORMs, considera usar [GORM](https://gorm.io/) con Gin.

### ¿Cómo pruebo los handlers de Gin?

Usa `net/http/httptest` para probar tus rutas:

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "testing"

  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
)

func SetupRouter() *gin.Engine {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })
  return r
}

func TestPingRoute(t *testing.T) {
  router := SetupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

Consulta la [documentación de pruebas](../testing/) para más ejemplos.

## Preguntas de Rendimiento

### ¿Cómo optimizo Gin para alto tráfico?

1. **Usar modo release**: Establecer `GIN_MODE=release`
2. **Deshabilitar middleware innecesario**: Solo usar lo que necesitas
3. **Usar `gin.New()` en lugar de `gin.Default()`** si quieres control manual del middleware
4. **Pool de conexiones**: Configurar correctamente los pools de conexiones de base de datos
5. **Caché**: Implementar caché para datos frecuentemente accedidos
6. **Balanceo de carga**: Usar proxy inverso (nginx, HAProxy)
7. **Profiling**: Usar pprof de Go para identificar cuellos de botella

```go
r := gin.New()
r.Use(gin.Recovery()) // Solo usar middleware de recovery

// Establecer límites del pool de conexiones
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### ¿Gin está listo para producción?

¡Sí! Gin es usado en producción por muchas empresas y ha sido probado en batalla a escala. Es uno de los frameworks web de Go más populares con:

- Mantenimiento activo y comunidad
- Extenso ecosistema de middleware
- Excelentes benchmarks de rendimiento
- Fuerte compatibilidad hacia atrás

## Solución de Problemas

### ¿Por qué mis parámetros de ruta no funcionan?

Asegúrate de que los parámetros de ruta usen la sintaxis `:` y se extraigan correctamente:

```go
// Correcto
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "ID de Usuario: %s", id)
})

// Incorrecto: /user/{id} o /user/<id>
```

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

### ¿Por qué falla el binding de la solicitud?

Razones comunes:

1. **Faltan etiquetas de binding**: Agregar etiquetas `json:"field"` o `form:"field"`
2. **Desajuste de Content-Type**: Asegurar que el cliente envíe el header Content-Type correcto
3. **Errores de validación**: Verificar etiquetas de validación y requisitos
4. **Campos no exportados**: Solo los campos de estructura exportados (capitalizados) se vinculan

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correcto
  Email string `json:"email"`                    // ✓ Correcto
  age   int    `json:"age"`                      // ✗ No se vinculará (no exportado)
}
```
