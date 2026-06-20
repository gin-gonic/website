---
title: "Binding"
sidebar:
  order: 4
---

Gin provides a powerful binding system that parses request data into Go structs and validates it automatically. Instead of manually calling `c.PostForm()` or reading `c.Request.Body`, you define a struct with tags and let Gin do the work.

## Bind vs ShouldBind

Gin offers two families of binding methods:

| Method | On error | Use when |
|--------|----------|----------|
| `c.Bind`, `c.BindJSON`, etc. | Calls `c.AbortWithError(400, err)` automatically | You want Gin to handle error responses |
| `c.ShouldBind`, `c.ShouldBindJSON`, etc. | Returns the error for you to handle | You want custom error responses |

In most cases, **prefer `ShouldBind`** for more control over error handling.

## Quick example

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## Supported formats

Gin can bind data from many sources: **JSON**, **XML**, **YAML**, **TOML**, **form data** (URL-encoded and multipart), **query strings**, **URI parameters**, and **headers**. Use the appropriate struct tag (`json`, `xml`, `yaml`, `form`, `uri`, `header`) to map fields. Validation rules go in the `binding` tag and use [go-playground/validator](https://github.com/go-playground/validator) syntax.

## In this section

- [**Model binding and validation**](./binding-and-validation/) -- Core binding concepts and validation rules
- [**Custom validators**](./custom-validators/) -- Register your own validation functions
- [**Binding query string or post data**](./bind-query-or-post/) -- Bind from query strings and form bodies
- [**Bind URI**](./bind-uri/) -- Bind path parameters into structs
- [**Bind header**](./bind-header/) -- Bind HTTP headers into structs
- [**Default value**](./default-value/) -- Set fallback values for missing fields
- [**Collection format**](./collection-format/) -- Handle array query parameters
- [**Custom unmarshaler**](./custom-unmarshaler/) -- Implement custom deserialization logic
- [**Bind HTML checkboxes**](./bind-html-checkboxes/) -- Handle checkbox form inputs
- [**Multipart/urlencoded binding**](./multipart-urlencoded-binding/) -- Bind multipart form data
- [**Custom struct tag**](./custom-struct-tag/) -- Use custom struct tags for field mapping
- [**Try to bind body into different structs**](./bind-body-into-different-structs/) -- Parse the request body more than once
