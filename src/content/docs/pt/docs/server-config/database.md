---
title: "Integração com Banco de Dados"
sidebar:
  order: 10
---

A maioria das aplicações Gin do mundo real precisa de um banco de dados. Este guia cobre como estruturar o acesso ao banco de dados de forma limpa, configurar pool de conexões e aplicar padrões que mantêm seus handlers testáveis e suas conexões saudáveis.

## Usando database/sql com Gin

O pacote `database/sql` da biblioteca padrão do Go funciona bem com o Gin. Abra a conexão uma vez no `main` e passe-a para seus handlers.

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

Sempre passe `c.Request.Context()` para chamadas de banco de dados para que queries sejam canceladas automaticamente quando o cliente desconectar.

## Configuração do pool de conexões

O pacote `database/sql` mantém um pool de conexões internamente. Para cargas de trabalho de produção, configure o pool para corresponder ao seu servidor de banco de dados e perfil de tráfego.

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

- `SetMaxOpenConns` previne que sua aplicação sobrecarregue o servidor de banco de dados sob alta carga.
- `SetMaxIdleConns` mantém conexões prontas para que novas requisições evitem o custo de criar novas conexões.
- `SetConnMaxLifetime` rotaciona conexões para que sua aplicação acompanhe mudanças de DNS e não mantenha sessões do lado do servidor obsoletas.
- `SetConnMaxIdleTime` fecha conexões que ficaram ociosas por muito tempo, liberando recursos em ambos os lados.

## Padrões de injeção de dependência

### Closure

A abordagem mais simples é usar closure sobre o `*sql.DB` nas suas funções handler.

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

Armazene a conexão no contexto do Gin para que qualquer handler possa recuperá-la.

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

### Struct com métodos

Agrupe handlers relacionados em uma struct que contém o handle do banco de dados. Esta abordagem escala bem quando você tem muitos handlers que compartilham as mesmas dependências.

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

Os padrões de closure e struct são geralmente preferidos em relação ao middleware porque fornecem segurança de tipos em tempo de compilação e evitam type assertions em tempo de execução.

## Usando GORM com Gin

[GORM](https://gorm.io) é um ORM popular para Go. Ele envolve `database/sql` e adiciona migrations, associações e um construtor de queries.

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

## Tratamento de transações em handlers de requisição

Quando uma requisição precisa realizar múltiplas escritas que devem ter sucesso ou falhar juntas, use uma transação de banco de dados.

### Com database/sql

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

### Com GORM

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

O método `Transaction` do GORM cuida do `Begin`, `Commit` e `Rollback` automaticamente com base no erro retornado.

## Melhores práticas

- **Inicialize a conexão de banco de dados no `main`** e compartilhe-a via closures, uma struct ou middleware. Nunca abra uma nova conexão por requisição.
- **Sempre use queries parametrizadas.** Passe entrada do usuário como argumentos (`$1`, `?`) em vez de concatenar strings. Isso previne injeção SQL.
- **Configure o pool de conexões para produção.** Defina `MaxOpenConns`, `MaxIdleConns` e `ConnMaxLifetime` para valores que correspondam aos limites do seu servidor de banco de dados e tráfego esperado.
- **Trate erros de conexão graciosamente.** Chame `db.Ping()` na inicialização para falhar rapidamente. Nos handlers, retorne códigos de status HTTP significativos e evite vazar detalhes internos de erro para os clientes.
- **Passe o contexto da requisição para queries.** Use `c.Request.Context()` para que queries de longa duração sejam canceladas quando o cliente desconectar ou um timeout disparar.
- **Feche `*sql.Rows` com `defer`.** Não fechar rows vaza conexões de volta ao pool.

## Veja também

- [Configuração HTTP customizada](/pt/docs/server-config/custom-http-config/)
- [Middleware Customizado](/pt/docs/middleware/custom-middleware/)
- [Usando middleware](/pt/docs/middleware/using-middleware/)
