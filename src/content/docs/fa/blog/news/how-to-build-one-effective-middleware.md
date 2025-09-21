---
title: "چگونه یک میان‌افزار مؤثر بسازیم"
linkTitle: "چگونه یک میان‌افزار مؤثر بسازیم"
lastUpdated: 2019-02-26
---

## اجزای تشکیل‌دهنده

میان‌افزار معمولاً از دو قسمت تشکیل شده است:

- قسمت اول یک بار، هنگام مقداردهی اولیه میان‌افزار اجرا می‌شود. اینجاست که اشیای سراسری، منطق پیکربندی و سایر مواردی که فقط یک بار در طول عمر برنامه باید انجام شوند را تنظیم می‌کنید.

- قسمت دوم در هر درخواست اجرا می‌شود. برای مثال، در یک میان‌افزار پایگاه‌داده، شیء سراسری پایگاه‌داده را به زمینه درخواست تزریق می‌کنید. وقتی در زمینه قرار گرفت، سایر میان‌افزارها و توابع هندلر شما می‌توانند آن را دریافت و استفاده کنند.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // این قسمت اول است
  // --->
  // نمونه مقداردهی اولیه: اعتبارسنجی پارامترهای ورودی
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // این قسمت دوم است
    // --->
    // نمونه اجرا برای هر درخواست: تزریق در زمینه
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## فرآیند اجرا

بیایید به مثال کد زیر نگاه کنیم:

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

مطابق بخش [اجزای تشکیل‌دهنده](#اجزای-تشکیل‌دهنده) بالا، هنگام اجرای فرآیند Gin، **قسمت اول** هر میان‌افزار ابتدا اجرا شده و خروجی زیر را چاپ می‌کند:

```go
globalMiddleware...1
mid1...1
mid2...1
```

ترتیب مقداردهی اولیه:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

هنگام ارسال یک درخواست—for مثال `curl -v localhost:8080/rest/n/api/some`—**قسمت دوم** هر میان‌افزار به ترتیب اجرا شده و خروجی زیر را نمایش می‌دهد:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

به عبارت دیگر، ترتیب اجرا به شرح زیر است:

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
