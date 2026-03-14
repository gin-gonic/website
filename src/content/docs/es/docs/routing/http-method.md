---
title: "Uso de métodos HTTP"
sidebar:
  order: 1
---

Gin proporciona métodos que se corresponden directamente con los verbos HTTP, lo que facilita la construcción de APIs RESTful. Cada método registra una ruta que responde solo al tipo de solicitud HTTP correspondiente:

| Método      | Uso típico en REST                       |
| ----------- | ---------------------------------------- |
| **GET**     | Obtener un recurso                       |
| **POST**    | Crear un nuevo recurso                   |
| **PUT**     | Reemplazar un recurso existente          |
| **PATCH**   | Actualizar parcialmente un recurso existente |
| **DELETE**  | Eliminar un recurso                      |
| **HEAD**    | Igual que GET pero sin cuerpo            |
| **OPTIONS** | Describir opciones de comunicación       |

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

### Pruebas con curl

Una vez que el servidor esté ejecutándose, puedes probar cada endpoint:

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

## Ver también

- [Parámetros en la ruta](/es/docs/routing/param-in-path/)
- [Agrupación de rutas](/es/docs/routing/grouping-routes/)
- [Parámetros de cadena de consulta](/es/docs/routing/querystring-param/)
