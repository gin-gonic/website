---
title: "Using HTTP method"
sidebar:
  order: 1
---

Gin provides methods that map directly to HTTP verbs, making it straightforward to build RESTful APIs. Each method registers a route that responds only to the corresponding HTTP request type:

| Method      | Typical REST Usage                  |
| ----------- | ----------------------------------- |
| **GET**     | Retrieve a resource                 |
| **POST**    | Create a new resource               |
| **PUT**     | Replace an existing resource        |
| **PATCH**   | Partially update an existing resource |
| **DELETE**  | Remove a resource                   |
| **HEAD**    | Same as GET but without a body      |
| **OPTIONS** | Describe communication options      |

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

### Testing with curl

Once the server is running, you can test each endpoint:

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

## See also

- [Parameters in path](/en/docs/routing/param-in-path/)
- [Grouping routes](/en/docs/routing/grouping-routes/)
- [Query string parameters](/en/docs/routing/querystring-param/)
