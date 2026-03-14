---
title: "Contexto e Cancelamento"
sidebar:
  order: 11
---

Cada handler do Gin recebe um `*gin.Context`, que envolve o `context.Context` padrão do Go junto com helpers de requisição e resposta. Entender como usar o contexto subjacente corretamente é essencial para construir aplicações de produção que lidam com timeouts, cancelamento e limpeza de recursos adequadamente.

## Acessando o contexto da requisição

O `context.Context` padrão para a requisição atual está disponível através de `c.Request.Context()`. Este é o contexto que você deve passar para qualquer chamada downstream -- queries de banco de dados, requisições HTTP ou outras operações de I/O.

```go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/data", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Pass ctx to any downstream function that accepts context.Context.
		log.Println("request context deadline:", ctx.Done())

		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
```

## Timeouts de requisição

Você pode aplicar um timeout a requisições individuais usando um middleware. Quando o timeout expira, o contexto é cancelado e qualquer chamada downstream que respeite o cancelamento de contexto retornará imediatamente.

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// TimeoutMiddleware wraps each request with a context deadline.
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		// Replace the request with one that carries the new context.
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/api/slow", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Simulate work that respects the context deadline.
		select {
		case <-time.After(10 * time.Second):
			c.JSON(http.StatusOK, gin.H{"result": "done"})
		case <-ctx.Done():
			c.JSON(http.StatusGatewayTimeout, gin.H{
				"error": "request timed out",
			})
		}
	})

	r.Run(":8080")
}
```

## Passando contexto para queries de banco de dados

Drivers de banco de dados em Go aceitam um `context.Context` como primeiro argumento. Sempre passe o contexto da requisição para que queries sejam automaticamente canceladas se o cliente desconectar ou a requisição expirar.

```go
package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://localhost/mydb?sslmode=disable")
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.GET("/api/users/:id", func(c *gin.Context) {
		ctx := c.Request.Context()
		id := c.Param("id")

		var name string
		err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id).Scan(&name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"id": id, "name": name})
	})

	r.Run(":8080")
}
```

## Passando contexto para chamadas HTTP de saída

Quando seu handler chama serviços externos, passe o contexto da requisição para que chamadas de saída sejam canceladas junto com a requisição recebida.

```go
package main

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/proxy", func(c *gin.Context) {
		ctx := c.Request.Context()

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://httpbin.org/delay/3", nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
	})

	r.Run(":8080")
}
```

## Tratando desconexão do cliente

Quando um cliente fecha a conexão (por exemplo, navega para outra página ou cancela uma requisição), o contexto da requisição é cancelado. Você pode detectar isso em handlers de longa duração para parar o trabalho antecipadamente e liberar recursos.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/stream", func(c *gin.Context) {
		ctx := c.Request.Context()

		for i := 0; ; i++ {
			select {
			case <-ctx.Done():
				log.Println("client disconnected, stopping work")
				return
			case <-time.After(1 * time.Second):
				c.SSEvent("message", gin.H{"count": i})
				c.Writer.Flush()
			}
		}
	})

	r.Run(":8080")
}
```

## Melhores práticas

- **Sempre propague o contexto da requisição.** Passe `c.Request.Context()` para toda função que aceite um `context.Context` -- chamadas de banco de dados, clientes HTTP, chamadas gRPC e qualquer operação de I/O. Isso garante que cancelamento e timeouts se propaguem por toda a cadeia de chamadas.

- **Não armazene `*gin.Context` em structs ou passe-o entre fronteiras de goroutines.** `gin.Context` está vinculado ao ciclo de vida da requisição/resposta HTTP e não é seguro para uso concorrente. Em vez disso, extraia os valores que precisa (contexto da requisição, parâmetros, headers) antes de criar goroutines.

- **Defina timeouts no nível do middleware.** Um middleware de timeout oferece um único lugar para impor prazos em todas as rotas, em vez de duplicar a lógica de timeout em cada handler.

- **Use `context.WithValue` com moderação.** Prefira `c.Set()` e `c.Get()` dentro dos handlers do Gin. Reserve `context.WithValue` para valores que precisam cruzar fronteiras de pacotes através de interfaces da biblioteca padrão.

## Armadilhas comuns

### Usando `gin.Context` em goroutines

`gin.Context` é reutilizado entre requisições para desempenho. Se você precisa acessá-lo de uma goroutine, **deve** chamar `c.Copy()` para criar uma cópia somente leitura. Usar o `gin.Context` original em uma goroutine leva a condições de corrida e comportamento imprevisível.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/async", func(c *gin.Context) {
		// WRONG: using c directly in a goroutine.
		// go func() {
		//     log.Println(c.Request.URL.Path) // data race!
		// }()

		// CORRECT: copy the context first.
		cCopy := c.Copy()
		go func() {
			time.Sleep(2 * time.Second)
			log.Printf("async work done for %s\n", cCopy.Request.URL.Path)
		}()

		c.JSON(http.StatusOK, gin.H{"status": "processing"})
	})

	r.Run(":8080")
}
```

### Ignorando cancelamento de contexto

Se seu handler não verifica `ctx.Done()`, ele continuará executando mesmo depois que o cliente desconectou, desperdiçando CPU e memória. Sempre use APIs cientes de contexto (`QueryRowContext`, `NewRequestWithContext`, `select` em `ctx.Done()`) para que o trabalho pare assim que o contexto for cancelado.

### Escrevendo a resposta após cancelamento do contexto

Uma vez que o contexto é cancelado, evite escrever em `c.Writer`. A conexão pode já estar fechada, e escritas falharão silenciosamente ou causarão panic. Verifique `ctx.Err()` antes de escrever se seu handler realiza trabalho de longa duração.

```go
func handler(c *gin.Context) {
	ctx := c.Request.Context()

	result, err := doExpensiveWork(ctx)
	if err != nil {
		if ctx.Err() != nil {
			// Client is gone; do not write a response.
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}
```
