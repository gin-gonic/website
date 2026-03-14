---
title: "Использование HTTP-методов"
sidebar:
  order: 1
---

Gin предоставляет методы, которые напрямую соответствуют HTTP-глаголам, что упрощает создание RESTful API. Каждый метод регистрирует маршрут, который отвечает только на соответствующий тип HTTP-запроса:

| Метод       | Типичное использование в REST     |
| ----------- | --------------------------------- |
| **GET**     | Получение ресурса                 |
| **POST**    | Создание нового ресурса           |
| **PUT**     | Замена существующего ресурса      |
| **PATCH**   | Частичное обновление ресурса      |
| **DELETE**  | Удаление ресурса                  |
| **HEAD**    | То же, что GET, но без тела       |
| **OPTIONS** | Описание параметров взаимодействия|

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

### Тестирование с помощью curl

После запуска сервера вы можете протестировать каждый эндпоинт:

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

## Смотрите также

- [Параметры в пути](/ru/docs/routing/param-in-path/)
- [Группировка маршрутов](/ru/docs/routing/grouping-routes/)
- [Параметры строки запроса](/ru/docs/routing/querystring-param/)
