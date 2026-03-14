---
title: "پارامترهای رشته پرس‌وجو"
sidebar:
  order: 3
---

پارامترهای رشته پرس‌وجو جفت‌های کلید-مقدار هستند که پس از `?` در URL ظاهر می‌شوند (به عنوان مثال، `/search?q=gin&page=2`). Gin دو متد برای خواندن آن‌ها ارائه می‌دهد:

- `c.Query("key")` مقدار پارامتر پرس‌وجو را برمی‌گرداند، یا در صورت عدم وجود کلید، یک **رشته خالی** برمی‌گرداند.
- `c.DefaultQuery("key", "default")` مقدار را برمی‌گرداند، یا در صورت عدم وجود کلید، **مقدار پیش‌فرض** مشخص شده را برمی‌گرداند.

هر دو متد میانبرهایی برای دسترسی به `c.Request.URL.Query()` با کد کمتر هستند.

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

### تست کنید

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

## همچنین ببینید

- [پارامترها در مسیر](/en/docs/routing/param-in-path/)
