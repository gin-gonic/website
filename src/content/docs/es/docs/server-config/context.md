---
title: "Contexto y cancelación"
sidebar:
  order: 11
---

Cada handler de Gin recibe un `*gin.Context`, que envuelve el `context.Context` estándar de Go junto con helpers de solicitud y respuesta. Entender cómo usar el contexto subyacente correctamente es esencial para construir aplicaciones en producción que manejen tiempos de espera, cancelación y limpieza de recursos adecuadamente.

## Acceder al contexto de la solicitud

El `context.Context` estándar para la solicitud actual está disponible a través de `c.Request.Context()`. Este es el contexto que debes pasar a cualquier llamada posterior -- consultas a bases de datos, solicitudes HTTP u otras operaciones de E/S.

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

## Tiempos de espera de solicitud

Puedes aplicar un tiempo de espera a solicitudes individuales usando un middleware. Cuando el tiempo de espera expira, el contexto se cancela y cualquier llamada posterior que respete la cancelación del contexto retornará inmediatamente.

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

## Pasar contexto a consultas de base de datos

Los drivers de base de datos en Go aceptan un `context.Context` como primer argumento. Siempre pasa el contexto de la solicitud para que las consultas se cancelen automáticamente si el cliente se desconecta o la solicitud expira.

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

## Pasar contexto a llamadas HTTP salientes

Cuando tu handler llama a servicios externos, pasa el contexto de la solicitud para que las llamadas salientes se cancelen junto con la solicitud entrante.

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

## Manejar la desconexión del cliente

Cuando un cliente cierra la conexión (ej. navega a otra página o cancela una solicitud), el contexto de la solicitud se cancela. Puedes detectar esto en handlers de larga duración para detener el trabajo anticipadamente y liberar recursos.

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

## Mejores prácticas

- **Siempre propaga el contexto de la solicitud.** Pasa `c.Request.Context()` a cada función que acepte un `context.Context` -- llamadas a bases de datos, clientes HTTP, llamadas gRPC y cualquier operación de E/S. Esto asegura que la cancelación y los tiempos de espera se propaguen a través de toda la cadena de llamadas.

- **No almacenes `*gin.Context` en structs ni lo pases entre límites de goroutines.** `gin.Context` está vinculado al ciclo de vida de solicitud/respuesta HTTP y no es seguro para uso concurrente. En su lugar, extrae los valores que necesitas (contexto de solicitud, parámetros, encabezados) antes de crear goroutines.

- **Establece tiempos de espera a nivel de middleware.** Un middleware de tiempo de espera te da un solo lugar para aplicar plazos en todas las rutas, en lugar de duplicar la lógica de tiempo de espera en cada handler.

- **Usa `context.WithValue` con moderación.** Prefiere `c.Set()` y `c.Get()` dentro de handlers de Gin. Reserva `context.WithValue` para valores que necesitan cruzar límites de paquetes a través de interfaces de la biblioteca estándar.

## Errores comunes

### Usar `gin.Context` en goroutines

`gin.Context` se reutiliza entre solicitudes para mejorar el rendimiento. Si necesitas acceder a él desde una goroutine, **debes** llamar a `c.Copy()` para crear una copia de solo lectura. Usar el `gin.Context` original en una goroutine lleva a condiciones de carrera y comportamiento impredecible.

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

### Ignorar la cancelación del contexto

Si tu handler no verifica `ctx.Done()`, seguirá ejecutándose incluso después de que el cliente se haya desconectado, desperdiciando CPU y memoria. Siempre usa APIs conscientes del contexto (`QueryRowContext`, `NewRequestWithContext`, `select` en `ctx.Done()`) para que el trabajo se detenga tan pronto como el contexto se cancele.

### Escribir la respuesta después de la cancelación del contexto

Una vez que un contexto se cancela, evita escribir en `c.Writer`. La conexión puede ya estar cerrada, y las escrituras fallarán silenciosamente o causarán un panic. Verifica `ctx.Err()` antes de escribir si tu handler realiza trabajo de larga duración.

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
