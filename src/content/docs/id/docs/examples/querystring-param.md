---
title: "Parameter kueri string"
---

```go
func main() {
  router := gin.Default()

  // Parameter kueri string diurai menggunakan objek request yang ada.
  // Request merespon ke url yang cocok:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // pintasan untuk c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```
