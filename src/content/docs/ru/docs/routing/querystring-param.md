---
title: "Параметры строки запроса"
sidebar:
  order: 3
---

Параметры строки запроса — это пары ключ-значение, которые появляются после `?` в URL (например, `/search?q=gin&page=2`). Gin предоставляет два метода для их чтения:

- `c.Query("key")` возвращает значение параметра запроса или **пустую строку**, если ключ отсутствует.
- `c.DefaultQuery("key", "default")` возвращает значение или указанное **значение по умолчанию**, если ключ отсутствует.

Оба метода являются сокращениями для доступа к `c.Request.URL.Query()` с меньшим количеством шаблонного кода.

```go
func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

### Проверка

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## Смотрите также

- [Параметры в пути](/ru/docs/routing/param-in-path/)
