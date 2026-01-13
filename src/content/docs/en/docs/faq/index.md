---
title: "FAQ"
sidebar:
  order: 9
---

## General Questions

### How do I enable live reload during development?

Use [Air](https://github.com/air-verse/air) for automatic live reloading during development. Air watches your files and rebuilds/restarts your application when changes are detected.

**Installation:**

```sh
# Install Air globally
go install github.com/air-verse/air@latest
```

**Setup:**

Create a `.air.toml` configuration file in your project root:

```sh
air init
```

This generates a default configuration. You can customize it for your Gin project:

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

**Usage:**

Simply run `air` in your project directory instead of `go run`:

```sh
air
```

Air will now watch your `.go` files and automatically rebuild/restart your Gin application on changes.

### How do I handle CORS in Gin?

Use the official [gin-contrib/cors](https://github.com/gin-contrib/cors) middleware:

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

### How do I serve static files?

Use `Static()` or `StaticFS()` to serve static files:

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

See the [Serving static files example](../examples/serving-static-files/) for more details.

### How do I handle file uploads?

Use `FormFile()` for single files or `MultipartForm()` for multiple files:

```go
// Single file upload
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")
  
  // Save the file
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

See the [Upload file examples](../examples/upload-file/) for more details.

### How do I implement authentication with JWT?

Use [gin-contrib/jwt](https://github.com/gin-contrib/jwt) or implement custom middleware:

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
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
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
    
    // Validate credentials (implement your own logic)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
    }
  })
  
  // Protected routes
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

### How do I set up request logging?

Gin includes a default logger middleware. Customize it or use structured logging:

```go
package main

import (
  "log"
  "time"
  
  "github.com/gin-gonic/gin"
)

// Custom logger middleware
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

For more advanced logging, see the [Custom log format example](../examples/custom-log-format/).

### How do I handle graceful shutdown?

Implement graceful shutdown to properly close connections:

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
    c.String(http.StatusOK, "Welcome!")
  })
  
  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }
  
  // Run server in a goroutine
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("listen: %s\n", err)
    }
  }()
  
  // Wait for interrupt signal to gracefully shutdown the server
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Shutting down server...")
  
  // Give outstanding requests 5 seconds to complete
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()
  
  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Server forced to shutdown:", err)
  }
  
  log.Println("Server exiting")
}
```

See the [Graceful restart or stop example](../examples/graceful-restart-or-stop/) for more details.

### Why am I getting  "404 Not Found" instead of "405 Method Not Allowed"?

By default, Gin returns 404 for routes that don't support the requested HTTP method. To return 405 Method Not Allowed, enable the `HandleMethodNotAllowed` option.

See [Method Not Allowed FAQ](./method-not-allowed/) for details.

### How do I bind query parameters and POST data together?

Use `ShouldBind()` which automatically selects the binding based on content type:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // Binds query params and request body (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

For more control, see [Bind query or post example](../examples/bind-query-or-post/).

### How do I validate request data?

Gin uses [go-playground/validator](https://github.com/go-playground/validator) for validation. Add validation tags to your structs:

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

For custom validators, see [Custom validators example](../examples/custom-validators/).

### How do I run Gin in production mode?

Set the `GIN_MODE` environment variable to `release`:

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

Or set it programmatically:

```go
gin.SetMode(gin.ReleaseMode)
```

Release mode:

- Disables debug logging
- Improves performance
- Reduces binary size slightly

### How do I handle database connections with Gin?

Use dependency injection or context to share database connections:

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
  
  // Method 1: Pass db to handlers
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
  
  // Method 2: Use middleware to inject db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })
  
  r.Run()
}
```

For ORMs, consider [GORM](https://gorm.io/) with Gin.

### How do I test Gin handlers?

Use `net/http/httptest` to test your routes:

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

See the [Testing documentation](../testing/) for more examples.

## Performance Questions

### How do I optimize Gin for high traffic?

1. **Use Release Mode**: Set `GIN_MODE=release`
2. **Disable unnecessary middleware**: Only use what you need
3. **Use `gin.New()` instead of `gin.Default()`** if you want manual middleware control
4. **Connection pooling**: Configure database connection pools properly
5. **Caching**: Implement caching for frequently accessed data
6. **Load balancing**: Use reverse proxy (nginx, HAProxy)
7. **Profiling**: Use Go's pprof to identify bottlenecks

```go
r := gin.New()
r.Use(gin.Recovery()) // Only use recovery middleware

// Set connection pool limits
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Is Gin production-ready?

Yes! Gin is used in production by many companies and has been battle-tested at scale. It's one of the most popular Go web frameworks with:

- Active maintenance and community
- Extensive middleware ecosystem
- Excellent performance benchmarks
- Strong backwards compatibility

## Troubleshooting

### Why are my route parameters not working?

Ensure route parameters use `:` syntax and are properly extracted:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

### Why is my middleware not executing?

Middleware must be registered before routes or route groups:

```go
// Correct order
r := gin.New()
r.Use(MyMiddleware()) // Register middleware first
r.GET("/ping", handler) // Then routes

// For route groups
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware for this group
{
  auth.GET("/dashboard", handler)
}
```

### Why is request binding failing?

Common reasons:

1. **Missing binding tags**: Add `json:"field"` or `form:"field"` tags
2. **Content-Type mismatch**: Ensure client sends correct Content-Type header
3. **Validation errors**: Check validation tags and requirements
4. **Unexported fields**: Only exported (capitalized) struct fields are bound

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```
