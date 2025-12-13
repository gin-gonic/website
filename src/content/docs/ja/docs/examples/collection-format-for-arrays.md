---
title: "配列のコレクションフォーマット"
---

フォームバインディングで `collection_format` 構造体タグを使用して、Gin が slice/array フィールドのリスト値を分割する方法を制御できます。

サポートされているフォーマット (v1.11+):

- multi (デフォルト): 繰り返しキーまたはカンマ区切り値
- csv: カンマ区切り値
- ssv: スペース区切り値
- tsv: タブ区切り値
- pipes: パイプ区切り値

例:

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

コレクションのデフォルト値 (v1.11+):

- `form` タグで `default` を使用してフォールバック値を設定します。
- `multi` と `csv` の場合、デフォルト値はセミコロンで区切ります: `default=1;2;3`。
- `ssv`、`tsv`、`pipes` の場合、デフォルト値には自然な区切り文字を使用します。

参照: 「フォームフィールドのデフォルト値をバインドする」の例。
