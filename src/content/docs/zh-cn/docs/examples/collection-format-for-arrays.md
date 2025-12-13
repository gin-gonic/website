---
title: "数组的集合格式"
---

你可以使用 `collection_format` 结构体标签来控制 Gin 在表单绑定时如何分割 slice/array 字段的列表值。

支持的格式 (v1.11+):

- multi (默认): 重复键或逗号分隔值
- csv: 逗号分隔值
- ssv: 空格分隔值
- tsv: 制表符分隔值
- pipes: 管道符分隔值

示例:

```go
package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
)

type Filters struct {
  Tags      []string `form:"tags" collection_format:"csv"`     // /search?tags=go,web,api
  Labels    []string `form:"labels" collection_format:"multi"` // /search?labels=bug&labels=helpwanted
  IdsSSV    []int    `form:"ids_ssv" collection_format:"ssv"`  // /search?ids_ssv=1 2 3
  IdsTSV    []int    `form:"ids_tsv" collection_format:"tsv"`  // /search?ids_tsv=1\t2\t3
  Levels    []int    `form:"levels" collection_format:"pipes"` // /search?levels=1|2|3
}

func main() {
  r := gin.Default()
  r.GET("/search", func(c *gin.Context) {
    var f Filters
    if err := c.ShouldBind(&f); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, f)
  })
  r.Run(":8080")
}
```

集合的默认值 (v1.11+):

- 在 `form` 标签中使用 `default` 来设置后备值。
- 对于 `multi` 和 `csv`，使用分号分隔默认值: `default=1;2;3`。
- 对于 `ssv`、`tsv` 和 `pipes`，在默认值中使用自然分隔符。

另请参阅: "绑定表单字段的默认值" 示例。
