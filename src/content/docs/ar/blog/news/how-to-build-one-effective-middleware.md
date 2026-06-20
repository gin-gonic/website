---
title: "كيف تبني وسيطاً فعّالاً"
linkTitle: "كيف تبني وسيطاً فعّالاً"
lastUpdated: 2019-02-26
---

## الأجزاء المكوّنة

يتكون الوسيط عادةً من جزأين:

- الجزء الأول يُنفذ مرة واحدة، عند تهيئة الوسيط. هنا تُعدّ الكائنات العامة ومنطق التكوين وغيرها -- كل ما يحتاج للحدوث مرة واحدة فقط في عمر التطبيق.

- الجزء الثاني يُنفذ مع كل طلب. على سبيل المثال، في وسيط قاعدة البيانات، ستحقن كائن قاعدة البيانات العام في سياق الطلب. بمجرد وجوده في السياق، يمكن للوسيطات الأخرى ودوال المعالجة استرداده واستخدامه.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // This is part one
  // --->
  // Example initialization: validate input params
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // This is part two
    // --->
    // Example execution per request: inject into context
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## عملية التنفيذ

لنلقِ نظرة على كود المثال التالي:

```go
func main() {
  router := gin.Default()

  router.Use(globalMiddleware())

  router.GET("/rest/n/api/*some", mid1(), mid2(), handler)

  router.Run()
}

func globalMiddleware() gin.HandlerFunc {
  fmt.Println("globalMiddleware...1")

  return func(c *gin.Context) {
    fmt.Println("globalMiddleware...2")
    c.Next()
    fmt.Println("globalMiddleware...3")
  }
}

func handler(c *gin.Context) {
  fmt.Println("exec handler.")
}

func mid1() gin.HandlerFunc {
  fmt.Println("mid1...1")

  return func(c *gin.Context) {

    fmt.Println("mid1...2")
    c.Next()
    fmt.Println("mid1...3")
  }
}

func mid2() gin.HandlerFunc {
  fmt.Println("mid2...1")

  return func(c *gin.Context) {
    fmt.Println("mid2...2")
    c.Next()
    fmt.Println("mid2...3")
  }
}
```

وفقاً لقسم [الأجزاء المكوّنة](#الأجزاء-المكوّنة) أعلاه، عند تشغيل عملية Gin، يُنفذ **الجزء الأول** من كل وسيط أولاً ويطبع المعلومات التالية:

```go
globalMiddleware...1
mid1...1
mid2...1
```

ترتيب التهيئة هو:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

عند إجراء طلب -- مثل `curl -v localhost:8080/rest/n/api/some` -- يُنفذ **الجزء الثاني** من كل وسيط بالترتيب وينتج المخرجات التالية:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

بعبارة أخرى، ترتيب التنفيذ هو:

```go
globalMiddleware...2
    |
    v
mid1...2
    |
    v
mid2...2
    |
    v
exec handler.
    |
    v
mid2...3
    |
    v
mid1...3
    |
    v
globalMiddleware...3
```
