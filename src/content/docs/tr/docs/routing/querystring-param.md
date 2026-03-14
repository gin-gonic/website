---
title: "Sorgu dizesi parametreleri"
sidebar:
  order: 3
---

Sorgu dizesi parametreleri, URL'deki `?` işaretinden sonra görünen anahtar-değer çiftleridir (örneğin, `/search?q=gin&page=2`). Gin bunları okumak için iki metod sağlar:

- `c.Query("key")` sorgu parametresinin değerini döndürür veya anahtar mevcut değilse **boş bir dize** döndürür.
- `c.DefaultQuery("key", "default")` değeri döndürür veya anahtar mevcut değilse belirtilen **varsayılan değeri** döndürür.

Her iki metod da `c.Request.URL.Query()` erişiminin daha az şablon koduyla kısayollarıdır.

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

### Test edin

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

## Ayrıca bakınız

- [Yol parametreleri](/tr/docs/routing/param-in-path/)
