---
title: "نحوه ساخت یک میان‌افزار مؤثر"
linkTitle: "نحوه ساخت یک میان‌افزار مؤثر"
lastUpdated: 2019-02-26
---

## اجزای تشکیل‌دهنده

میان‌افزار معمولاً از دو بخش تشکیل شده است:

- بخش اول یک بار اجرا می‌شود، زمانی که میان‌افزار خود را مقداردهی اولیه می‌کنید. اینجاست که اشیاء سراسری، منطق پیکربندی و غیره را تنظیم می‌کنید -- همه چیزی که فقط یک بار در طول عمر برنامه نیاز به اتفاق افتادن دارد.

- بخش دوم در هر درخواست اجرا می‌شود. مثلاً در یک میان‌افزار پایگاه داده، شیء سراسری پایگاه داده خود را به context درخواست تزریق می‌کنید. وقتی در context قرار گرفت، سایر میان‌افزارها و توابع handler شما می‌توانند آن را بازیابی و استفاده کنند.

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

## فرآیند اجرا

بیایید کد مثال زیر را بررسی کنیم:

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

بر اساس بخش [اجزای تشکیل‌دهنده](#اجزای-تشکیلدهنده) بالا، وقتی فرآیند Gin را اجرا می‌کنید، ابتدا **بخش اول** هر میان‌افزار اجرا شده و اطلاعات زیر را چاپ می‌کند:

```go
globalMiddleware...1
mid1...1
mid2...1
```

ترتیب مقداردهی اولیه به شکل زیر است:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

وقتی درخواستی ارسال می‌کنید -- مثلاً `curl -v localhost:8080/rest/n/api/some` -- **بخش دوم** هر میان‌افزار به ترتیب اجرا شده و خروجی زیر را تولید می‌کند:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

به عبارت دیگر، ترتیب اجرا به شکل زیر است:

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
