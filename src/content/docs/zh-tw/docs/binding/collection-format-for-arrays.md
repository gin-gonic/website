---
title: "陣列的集合格式"
sidebar:
  order: 6
---

你可以使用 `collection_format` 結構體標籤搭配表單綁定，來控制 Gin 如何分割切片/陣列欄位的列表值。

支援的格式（v1.11+）：

- multi（預設）：重複的鍵或逗號分隔的值
- csv：逗號分隔的值
- ssv：空格分隔的值
- tsv：Tab 分隔的值
- pipes：管道符號分隔的值

範例：

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

集合的預設值（v1.11+）：

- 使用 `form` 標籤中的 `default` 來設定備用值。
- 對於 `multi` 和 `csv`，用分號分隔預設值：`default=1;2;3`。
- 對於 `ssv`、`tsv` 和 `pipes`，在預設值中使用自然分隔符。

另請參閱：「為表單欄位綁定預設值」範例。
