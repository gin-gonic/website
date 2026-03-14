---
title: "Integración con base de datos"
sidebar:
  order: 10
---

La mayoría de las aplicaciones Gin del mundo real necesitan una base de datos. Esta guía cubre cómo estructurar el acceso a la base de datos de forma limpia, configurar el pool de conexiones y aplicar patrones que mantengan tus handlers testeables y tus conexiones saludables.

## Usando database/sql con Gin

El paquete `database/sql` de la biblioteca estándar de Go funciona bien con Gin. Abre la conexión una vez en `main` y pásala a tus handlers.

```go
package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "host=localhost port=5432 user=app dbname=mydb sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Verify the connection is alive
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	r.GET("/users/:id", func(c *gin.Context) {
		var name string
		err := db.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", c.Param("id")).Scan(&name)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"name": name})
	})

	r.Run(":8080")
}
```

Siempre pasa `c.Request.Context()` a las llamadas de base de datos para que las consultas se cancelen automáticamente cuando el cliente se desconecta.

## Configuración del pool de conexiones

El paquete `database/sql` mantiene un pool de conexiones internamente. Para cargas de trabajo en producción, configura el pool para que coincida con tu base de datos y perfil de tráfico.

```go
db, err := sql.Open("postgres", dsn)
if err != nil {
	log.Fatal(err)
}

// Maximum number of open connections to the database.
db.SetMaxOpenConns(25)

// Maximum number of idle connections retained in the pool.
db.SetMaxIdleConns(10)

// Maximum amount of time a connection may be reused.
db.SetConnMaxLifetime(5 * time.Minute)

// Maximum amount of time a connection may sit idle before being closed.
db.SetConnMaxIdleTime(1 * time.Minute)
```

- `SetMaxOpenConns` previene que tu aplicación abrume al servidor de base de datos bajo alta carga.
- `SetMaxIdleConns` mantiene conexiones preparadas para que las nuevas solicitudes eviten el costo de establecer conexión.
- `SetConnMaxLifetime` rota las conexiones para que tu app detecte cambios DNS y no mantenga sesiones obsoletas del lado del servidor.
- `SetConnMaxIdleTime` cierra conexiones que han estado inactivas demasiado tiempo, liberando recursos en ambos lados.

## Patrones de inyección de dependencias

### Closure

El enfoque más simple es envolver `*sql.DB` en tus funciones handler mediante closures.

```go
package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func listUsers(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.QueryContext(c.Request.Context(), "SELECT id, name FROM users")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
			return
		}
		defer rows.Close()

		type User struct {
			ID   int    `json:"id"`
			Name string `json:"name"`
		}
		var users []User
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.ID, &u.Name); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "scan failed"})
				return
			}
			users = append(users, u)
		}
		c.JSON(http.StatusOK, users)
	}
}

func main() {
	db, _ := sql.Open("postgres", "your-dsn")
	defer db.Close()

	r := gin.Default()
	r.GET("/users", listUsers(db))
	r.Run(":8080")
}
```

### Middleware

Almacena la conexión en el contexto de Gin para que cualquier handler pueda recuperarla.

```go
func DatabaseMiddleware(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func main() {
	db, _ := sql.Open("postgres", "your-dsn")
	defer db.Close()

	r := gin.Default()
	r.Use(DatabaseMiddleware(db))

	r.GET("/users/:id", func(c *gin.Context) {
		db := c.MustGet("db").(*sql.DB)
		// use db...
		_ = db
	})

	r.Run(":8080")
}
```

### Struct con métodos

Agrupa handlers relacionados en un struct que contiene el manejador de base de datos. Este enfoque escala bien cuando tienes muchos handlers que comparten las mismas dependencias.

```go
type UserHandler struct {
	DB *sql.DB
}

func (h *UserHandler) Get(c *gin.Context) {
	var name string
	err := h.DB.QueryRowContext(c.Request.Context(), "SELECT name FROM users WHERE id = $1", c.Param("id")).Scan(&name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"name": name})
}

func main() {
	db, _ := sql.Open("postgres", "your-dsn")
	defer db.Close()

	uh := &UserHandler{DB: db}

	r := gin.Default()
	r.GET("/users/:id", uh.Get)
	r.Run(":8080")
}
```

Los patrones de closure y struct generalmente se prefieren sobre middleware porque proporcionan seguridad de tipos en tiempo de compilación y evitan aserciones de tipo en tiempo de ejecución.

## Usando GORM con Gin

[GORM](https://gorm.io) es un ORM popular de Go. Envuelve `database/sql` y agrega migraciones, asociaciones y un constructor de consultas.

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

func main() {
	dsn := "host=localhost user=app dbname=mydb port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	// Auto-migrate the schema
	db.AutoMigrate(&Product{})

	r := gin.Default()

	r.POST("/products", func(c *gin.Context) {
		var p Product
		if err := c.ShouldBindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := db.Create(&p).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create product"})
			return
		}
		c.JSON(http.StatusCreated, p)
	})

	r.GET("/products/:id", func(c *gin.Context) {
		var p Product
		if err := db.First(&p, c.Param("id")).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusOK, p)
	})

	r.Run(":8080")
}
```

## Manejo de transacciones en handlers de solicitud

Cuando una solicitud necesita realizar múltiples escrituras que deben tener éxito o fallar juntas, usa una transacción de base de datos.

### Con database/sql

```go
r.POST("/transfer", func(c *gin.Context) {
	tx, err := db.BeginTx(c.Request.Context(), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not begin transaction"})
		return
	}
	// Ensure rollback runs if we return early due to an error.
	defer tx.Rollback()

	_, err = tx.ExecContext(c.Request.Context(),
		"UPDATE accounts SET balance = balance - $1 WHERE id = $2", 100, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "debit failed"})
		return
	}

	_, err = tx.ExecContext(c.Request.Context(),
		"UPDATE accounts SET balance = balance + $1 WHERE id = $2", 100, 2)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "credit failed"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "transfer complete"})
})
```

### Con GORM

```go
r.POST("/transfer", func(c *gin.Context) {
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&Account{}).Where("id = ?", 1).
			Update("balance", gorm.Expr("balance - ?", 100)).Error; err != nil {
			return err
		}
		if err := tx.Model(&Account{}).Where("id = ?", 2).
			Update("balance", gorm.Expr("balance + ?", 100)).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "transfer failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "transfer complete"})
})
```

El método `Transaction` de GORM maneja `Begin`, `Commit` y `Rollback` automáticamente basándose en el error retornado.

## Mejores prácticas

- **Inicializa la conexión a la base de datos en `main`** y compártela mediante closures, un struct o middleware. Nunca abras una nueva conexión por solicitud.
- **Siempre usa consultas parametrizadas.** Pasa la entrada del usuario como argumentos (`$1`, `?`) en lugar de concatenar cadenas. Esto previene la inyección SQL.
- **Configura el pool de conexiones para producción.** Establece `MaxOpenConns`, `MaxIdleConns` y `ConnMaxLifetime` a valores que coincidan con los límites de tu servidor de base de datos y el tráfico esperado.
- **Maneja los errores de conexión de forma elegante.** Llama a `db.Ping()` al inicio para fallar rápidamente. En los handlers, devuelve códigos de estado HTTP significativos y evita filtrar detalles internos de error a los clientes.
- **Pasa el contexto de la solicitud a las consultas.** Usa `c.Request.Context()` para que las consultas de larga duración se cancelen cuando el cliente se desconecta o un tiempo de espera se activa.
- **Cierra `*sql.Rows` con `defer`.** No cerrar las filas filtra conexiones de vuelta al pool.

## Ver también

- [Configuración HTTP personalizada](/es/docs/server-config/custom-http-config/)
- [Middleware personalizado](/es/docs/middleware/custom-middleware/)
- [Usar middleware](/es/docs/middleware/using-middleware/)
