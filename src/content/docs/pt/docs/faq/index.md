---
title: "Perguntas Frequentes"
sidebar:
  order: 15
---

## Perguntas Gerais

### Como habilito o live reload durante o desenvolvimento?

Use [Air](https://github.com/air-verse/air) para recarregamento automático em tempo real durante o desenvolvimento. O Air monitora seus arquivos e reconstrói/reinicia sua aplicação quando mudanças são detectadas.

**Instalação:**

```sh
go install github.com/air-verse/air@latest
```

**Configuração:**

Crie um arquivo de configuração `.air.toml` na raiz do seu projeto:

```sh
air init
```

Em seguida, execute `air` no diretório do seu projeto em vez de `go run`:

```sh
air
```

O Air monitorará seus arquivos `.go` e automaticamente reconstruirá/reiniciará sua aplicação Gin quando houver mudanças. Veja a [documentação do Air](https://github.com/air-verse/air) para opções de configuração.

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

Para uma visão geral completa de segurança, veja [Melhores práticas de segurança](/pt/docs/middleware/security-guide/).

### Como servir arquivos estáticos?

Use `Static()` ou `StaticFS()` para servir arquivos estáticos:

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

Veja [Servindo dados de arquivo](/pt/docs/rendering/serving-data-from-file/) para mais detalhes.

### Como lidar com upload de arquivos?

Use `FormFile()` para arquivos únicos ou `MultipartForm()` para múltiplos arquivos:

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

Veja a documentação de [Upload de arquivos](/pt/docs/routing/upload-file/) para mais detalhes.

### Como implementar autenticação com JWT?

Use [gin-contrib/jwt](https://github.com/gin-contrib/jwt) ou implemente middleware customizado. Aqui está um exemplo mínimo:

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

Para autenticação baseada em sessão, veja [Gerenciamento de sessões](/pt/docs/middleware/session-management/).

### Como configurar logging de requisições?

O Gin inclui um middleware de logger padrão via `gin.Default()`. Para logging JSON estruturado em produção, veja [Logging estruturado](/pt/docs/logging/structured-logging/).

Para customização básica de log:

```go
r := gin.New()
r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
  SkipPaths: []string{"/healthz"},
}))
r.Use(gin.Recovery())
```

Veja a seção [Logging](/pt/docs/logging/) para todas as opções incluindo formatos customizados, saída para arquivo e omissão de query strings.

### Como lidar com desligamento gracioso?

Veja [Reinicialização ou parada graciosa](/pt/docs/server-config/graceful-restart-or-stop/) para um guia completo com exemplos de código.

### Por que estou recebendo "404 Not Found" em vez de "405 Method Not Allowed"?

Por padrão, o Gin retorna 404 para rotas que não suportam o método HTTP requisitado. Defina `HandleMethodNotAllowed = true` para retornar 405 em vez disso:

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
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

Veja a seção [Binding](/pt/docs/binding/) para todas as opções de binding.

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
  c.JSON(200, gin.H{"message": "User is valid"})
})
```

Veja [Binding e validação](/pt/docs/binding/binding-and-validation/) para validadores customizados e uso avançado.

### Como executar o Gin em modo de produção?

Defina a variável de ambiente `GIN_MODE` como `release`:

```sh
export GIN_MODE=release
# or
GIN_MODE=release ./your-app
```

Ou defina programaticamente:

```go
gin.SetMode(gin.ReleaseMode)
```

O modo release desabilita o logging de debug e melhora o desempenho.

### Como lidar com conexões de banco de dados com o Gin?

Veja [Integração com banco de dados](/pt/docs/server-config/database/) para um guia completo cobrindo `database/sql`, GORM, pool de conexões e padrões de injeção de dependência.

### Como testar handlers do Gin?

Use `net/http/httptest` para testar suas rotas:

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

Veja a documentação de [Testes](/pt/docs/testing/) para mais exemplos.

## Perguntas sobre Desempenho

### Como otimizar o Gin para alto tráfego?

1. **Use o modo Release**: Defina `GIN_MODE=release`
2. **Desabilite middleware desnecessário**: Use apenas o que você precisa
3. **Use `gin.New()` em vez de `gin.Default()`** para controle manual de middleware
4. **Pool de conexões**: Configure pools de conexão do banco de dados (veja [Integração com banco de dados](/pt/docs/server-config/database/))
5. **Cache**: Implemente cache para dados acessados frequentemente
6. **Balanceamento de carga**: Use proxy reverso (nginx, HAProxy)
7. **Profiling**: Use o pprof do Go para identificar gargalos
8. **Monitoramento**: Configure [métricas e monitoramento](/pt/docs/server-config/metrics/) para acompanhar o desempenho

### O Gin está pronto para produção?

Sim. O Gin é usado em produção por muitas empresas e foi testado em batalha em escala. Veja [Usuários](/pt/docs/users/) para exemplos de projetos usando Gin em produção.

## Solução de Problemas

### Por que meus parâmetros de rota não estão funcionando?

Certifique-se de que os parâmetros de rota usam a sintaxe `:` e são extraídos corretamente:

```go
// Correct
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "User ID: %s", id)
})

// Not: /user/{id} or /user/<id>
```

Veja [Parâmetros no caminho](/pt/docs/routing/param-in-path/) para detalhes.

### Por que meu middleware não está executando?

O middleware deve ser registrado antes das rotas ou grupos de rotas:

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

Veja [Usando middleware](/pt/docs/middleware/using-middleware/) para detalhes.

### Por que o binding de requisição está falhando?

Razões comuns:

1. **Tags de binding ausentes**: Adicione tags `json:"field"` ou `form:"field"`
2. **Content-Type incompatível**: Certifique-se de que o cliente envia o header Content-Type correto
3. **Erros de validação**: Verifique as tags de validação e requisitos
4. **Campos não exportados**: Apenas campos exportados (com letra maiúscula) da struct são vinculados

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ Correct
  Email string `json:"email"`                    // ✓ Correct
  age   int    `json:"age"`                      // ✗ Won't bind (unexported)
}
```

Veja [Binding e validação](/pt/docs/binding/binding-and-validation/) para detalhes.
