---
title: "使用樣板建置單一二進位檔"
---

您可以使用 [go-assets][] 將包含樣板的伺服器建置為單一二進位檔。

[go-assets]: https://github.com/jessevdk/go-assets

```go
import (
  "html/template"
  "io/ioutil"
  "net/http"
  "strings"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.New()

  t, err := loadTemplate()
  if err != nil {
    panic(err)
  }
  r.SetHTMLTemplate(t)

  r.GET("/", func(c *gin.Context) {
    c.HTML(http.StatusOK, "/html/index.tmpl", nil)
  })
  r.Run(":8080")
}

// loadTemplate 載入由 go-assets-builder 嵌入的樣板
func loadTemplate() (*template.Template, error) {
  t := template.New("")
  for name, file := range Assets.Files {
    if file.IsDir() || !strings.HasSuffix(name, ".tmpl") {
      continue
    }
    h, err := ioutil.ReadAll(file)
    if err != nil {
      return nil, err
    }
    t, err = t.New(name).Parse(string(h))
    if err != nil {
      return nil, err
    }
  }
  return t, nil
}
```

請參閱 [assets-in-binary/example01](https://github.com/gin-gonic/examples/tree/master/assets-in-binary/example01) 目錄中的完整範例。
