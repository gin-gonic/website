---
title: "陣列的集合格式"
---

你可以使用 `collection_format` 結構體標籤來控制 Gin 在表單綁定時如何分割 slice/array 欄位的列表值。

支援的格式 (v1.11+):

- multi (預設): 重複鍵或逗號分隔值
- csv: 逗號分隔值
- ssv: 空格分隔值
- tsv: 定位字元分隔值
- pipes: 管道符分隔值

範例:

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

集合的預設值 (v1.11+):

- 在 `form` 標籤中使用 `default` 來設定後備值。
- 對於 `multi` 和 `csv`，使用分號分隔預設值: `default=1;2;3`。
- 對於 `ssv`、`tsv` 和 `pipes`，在預設值中使用自然分隔符。

另請參閱: "綁定表單欄位的預設值" 範例。
