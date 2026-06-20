---
title: "Usando métodos HTTP"
sidebar:
  order: 1
---

O Gin fornece métodos que mapeiam diretamente para os verbos HTTP, tornando simples a construção de APIs RESTful. Cada método registra uma rota que responde apenas ao tipo correspondente de requisição HTTP:

| Método      | Uso típico em REST                     |
| ----------- | -------------------------------------- |
| **GET**     | Obter um recurso                       |
| **POST**    | Criar um novo recurso                  |
| **PUT**     | Substituir um recurso existente        |
| **PATCH**   | Atualizar parcialmente um recurso existente |
| **DELETE**  | Remover um recurso                     |
| **HEAD**    | Igual ao GET, mas sem corpo            |
| **OPTIONS** | Descrever opções de comunicação        |

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "GET"})
}

func posting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "POST"})
}

func putting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PUT"})
}

func deleting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "DELETE"})
}

func patching(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PATCH"})
}

func head(c *gin.Context) {
	c.Status(http.StatusOK)
}

func options(c *gin.Context) {
	c.Status(http.StatusOK)
}

func main() {
	// Creates a gin router with default middleware:
	// logger and recovery (crash-free) middleware
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// By default it serves on :8080 unless a
	// PORT environment variable was defined.
	router.Run()
	// router.Run(":3000") for a hard coded port
}
```

### Testando com curl

Quando o servidor estiver rodando, você pode testar cada endpoint:

```sh
# GET request
curl -X GET http://localhost:8080/someGet

# POST request
curl -X POST http://localhost:8080/somePost

# PUT request
curl -X PUT http://localhost:8080/somePut

# DELETE request
curl -X DELETE http://localhost:8080/someDelete

# PATCH request
curl -X PATCH http://localhost:8080/somePatch

# HEAD request (returns headers only, no body)
curl -I http://localhost:8080/someHead

# OPTIONS request
curl -X OPTIONS http://localhost:8080/someOptions
```

## Veja também

- [Parâmetros no caminho](/pt/docs/routing/param-in-path/)
- [Agrupamento de rotas](/pt/docs/routing/grouping-routes/)
- [Parâmetros de query string](/pt/docs/routing/querystring-param/)
