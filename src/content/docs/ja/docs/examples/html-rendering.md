---
title: 'HTML をレンダリングする'
---

Gin uses the [html/template](https://pkg.go.dev/html/template) package for
HTML rendering.  For more information about how to use them, including
available placeholders, see the documentation for
[text/template](https://pkg.go.dev/text/template)

LoadHTMLGlob() あるいは LoadHTMLFiles() メソッドを使用してください。

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

別のディレクトリにある同名のテンプレートを使う方法です。

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

**Note:** Please wrap your HTML template in the `{{define <template-path>}} {{end}}` block and define your template file with the relative path `<template-path>`. Otherwise, GIN will not properly parse the template files.

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

### カスタムテンプレートエンジン

独自のHTMLテンプレートエンジンを使うこともできます。

```go
import "html/template"

func main() {
       router := gin.Default()
       html := template.Must(template.ParseFiles("file1", "file2"))
       router.SetHTMLTemplate(html)
       router.Run(":8080")
}
```

### カスタムデリミタ

独自のデリミタを使用することもできます。

```go
       router := gin.Default()
       router.Delims("{[{", "}]}")
       router.LoadHTMLGlob("/path/to/templates")
```

### カスタムテンプレート関数

詳細は [サンプルコード](https://github.com/gin-gonic/examples/tree/master/template)
を参照。

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

Result:
```sh
Date: 2017/07/01
```
