---
title: "FAQ"
sidebar:
  order: 9
---

## Perguntas Gerais

### Como habilito o recarregamento ao vivo durante o desenvolvimento?

Use [Air](https://github.com/air-verse/air) para recarregamento automático ao vivo durante o desenvolvimento. O Air observa seus arquivos e reconstrói/reinicia sua aplicação quando mudanças são detectadas.

**Instalação:**

```sh
# Instalar Air globalmente
go install github.com/air-verse/air@latest
```

**Configuração:**

Crie um arquivo de configuração `.air.toml` na raiz do seu projeto:

```sh
air init
```

Isso gera uma configuração padrão. Você pode personalizá-la para seu projeto Gin:

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

Simplesmente execute `air` no diretório do seu projeto em vez de `go run`:

```sh
air
```

O Air agora observará seus arquivos `.go` e reconstruirá/reiniciará automaticamente sua aplicação Gin nas mudanças.

### Como lidar com CORS no Gin?

Use o middleware oficial [gin-contrib/cors](https://github.com/gin-contrib/cors):

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Configuração CORS padrão
  r.Use(cors.Default())

  // Ou personalize as configurações CORS
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

### Como servir arquivos estáticos?

Use `Static()` ou `StaticFS()` para servir arquivos estáticos:

```go
func main() {
  r := gin.Default()

  // Servir arquivos do diretório ./assets em /assets/*
  r.Static("/assets", "./assets")

  // Servir um único arquivo
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Servir de sistema de arquivos embutido (Go 1.16+)
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

Veja o [exemplo de servir arquivos estáticos](../examples/serving-static-files/) para mais detalhes.

### Como lidar com upload de arquivos?

Use `FormFile()` para arquivos únicos ou `MultipartForm()` para múltiplos arquivos:

```go
// Upload de arquivo único
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // Salvar o arquivo
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "Arquivo %s enviado com sucesso", file.Filename)
})

// Upload de múltiplos arquivos
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d arquivos enviados", len(files))
})
```

Veja os [exemplos de upload de arquivo](../examples/upload-file/) para mais detalhes.

### Como implementar autenticação com JWT?

Use [gin-contrib/jwt](https://github.com/gin-contrib/jwt) ou implemente middleware personalizado:

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
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Token de autorização ausente"})
      c.Abort()
      return
    }

    // Remover prefixo "Bearer " se presente
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
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Claims de token inválidas"})
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

    // Validar credenciais (implemente sua própria lógica)
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciais inválidas"})
    }
  })

  // Rotas protegidas
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

### Como configurar logging de requisições?

O Gin inclui um middleware de logger padrão. Personalize-o ou use logging estruturado:

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// Middleware de logger personalizado
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

Para logging mais avançado, veja o [exemplo de formato de log personalizado](../examples/custom-log-format/).

### Como lidar com graceful shutdown?

Implemente graceful shutdown para fechar conexões corretamente:

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
    c.String(http.StatusOK, "Bem-vindo!")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // Executar servidor em uma goroutine
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("escutar: %s\n", err)
    }
  }()

  // Aguardar sinal de interrupção para desligar o servidor gracefully
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("Desligando servidor...")

  // Dar às requisições pendentes 5 segundos para completar
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("Servidor forçado a desligar:", err)
  }

  log.Println("Servidor encerrado")
}
```

Veja o [exemplo de reinício ou parada graceful](../examples/graceful-restart-or-stop/) para mais detalhes.

### Por que estou recebendo "404 Not Found" em vez de "405 Method Not Allowed"?

Por padrão, o Gin retorna 404 para rotas que não suportam o método HTTP solicitado. Para retornar 405 Method Not Allowed, habilite a opção `HandleMethodNotAllowed`.

Veja [FAQ de Method Not Allowed](./method-not-allowed/) para detalhes.

### Como vincular parâmetros de query e dados POST juntos?

Use `ShouldBind()` que seleciona automaticamente o binding baseado no tipo de conteúdo:

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // Vincula parâmetros de query e corpo da requisição (JSON/form)
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Para mais controle, veja [exemplo de vincular query ou post](../examples/bind-query-or-post/).

### Como validar dados da requisição?

O Gin usa [go-playground/validator](https://github.com/go-playground/validator) para validação. Adicione tags de validação às suas structs:

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
  c.JSON(200, gin.H{"message": "Usuário válido"})
})
```

Para validadores personalizados, veja o [exemplo de validadores personalizados](../examples/custom-validators/).

### Como executar o Gin em modo produção?

Defina a variável de ambiente `GIN_MODE` para `release`:

```sh
export GIN_MODE=release
# ou
GIN_MODE=release ./your-app
```

Ou defina programaticamente:

```go
gin.SetMode(gin.ReleaseMode)
```

Modo release:

- Desabilita logging de debug
- Melhora o desempenho
- Reduz ligeiramente o tamanho do binário

### Como lidar com conexões de banco de dados com Gin?

Use injeção de dependência ou contexto para compartilhar conexões de banco de dados:

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

  // Método 1: Passar db para os handlers
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

  // Método 2: Usar middleware para injetar db
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

Para ORMs, considere usar [GORM](https://gorm.io/) com Gin.

### Como testar handlers do Gin?

Use `net/http/httptest` para testar suas rotas:

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

Veja a [documentação de testes](../testing/) para mais exemplos.

## Perguntas de Desempenho

### Como otimizar o Gin para alto tráfego?

1. **Usar modo release**: Definir `GIN_MODE=release`
2. **Desabilitar middleware desnecessário**: Usar apenas o que você precisa
3. **Usar `gin.New()` em vez de `gin.Default()`** se quiser controle manual do middleware
4. **Pool de conexões**: Configurar corretamente os pools de conexão do banco de dados
5. **Cache**: Implementar cache para dados frequentemente acessados
6. **Balanceamento de carga**: Usar proxy reverso (nginx, HAProxy)
7. **Profiling**: Usar pprof do Go para identificar gargalos

```go
r := gin.New()
r.Use(gin.Recovery()) // Usar apenas middleware de recovery

// Definir limites do pool de conexões
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### O Gin está pronto para produção?

Sim! O Gin é usado em produção por muitas empresas e foi testado em batalha em escala. É um dos frameworks web Go mais populares com:

- Manutenção ativa e comunidade
- Extenso ecossistema de middleware
- Excelentes benchmarks de desempenho
- Forte compatibilidade retroativa

## Solução de Problemas

### Por que meus parâmetros de rota não estão funcionando?

Certifique-se de que os parâmetros de rota usem a sintaxe `:` e sejam extraídos corretamente:

```go
// Correto
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "ID do Usuário: %s", id)
})

// Errado: /user/{id} ou /user/<id>
```

### Por que meu middleware não está executando?

O middleware deve ser registrado antes das rotas ou grupos de rotas:

```go
// Ordem correta
r := gin.New()
r.Use(MyMiddleware()) // Registrar middleware primeiro
r.GET("/ping", handler) // Depois as rotas

// Para grupos de rotas
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // Middleware para este grupo
{
  auth.GET("/dashboard", handler)
}
```

### Por que o binding da requisição está falhando?

Razões comuns:

1. **Faltando tags de binding**: Adicionar tags `json:"field"` ou `form:"field"`
2. **Content-Type incompatível**: Garantir que o cliente envie o header Content-Type correto
3. **Erros de validação**: Verificar tags de validação e requisitos
4. **Campos não exportados**: Apenas campos de struct exportados (capitalizados) são vinculados

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correto
  Email string `json:"email"`                    // ✓ Correto
  age   int    `json:"age"`                      // ✗ Não será vinculado (não exportado)
}
```
