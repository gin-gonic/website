---
title: "綁定表單欄位的預設值"
---

有時候你希望當客戶端沒有發送值時，欄位能夠回退到預設值。Gin 的表單綁定透過 `form` 結構體標籤中的 `default` 選項支援預設值。這適用於純量類型，從 Gin v1.11 開始，也適用於具有明確集合格式的集合（切片/陣列）。

關鍵要點：

- 將預設值放在表單鍵的後面：`form:"name,default=William"`。
- 對於集合，使用 `collection_format:"multi|csv|ssv|tsv|pipes"` 指定值的分隔方式。
- 對於 `multi` 和 `csv`，在預設值中使用分號分隔值（例如 `default=1;2;3`）。Gin 會在內部將其轉換為逗號，以保持標籤解析器的明確性。
- 對於 `ssv`（空格）、`tsv`（定位字元）和 `pipes`（|），在預設值中使用自然分隔符。

範例：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv：在預設值中使用 ;
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // 根據 Content-Type 推斷綁定器
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

如果你發送沒有請求主體的 POST 請求，Gin 會使用預設值回應：

```sh
curl -X POST http://localhost:8080/person
```

回應（範例）：

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

注意事項：

- 逗號在 Go 結構體標籤語法中用於分隔選項；避免在預設值中使用逗號。
- 對於 `multi` 和 `csv`，分號用於分隔預設值；不要在這些格式的單個預設值中包含分號。
- 無效的 `collection_format` 值將導致綁定錯誤。

相關變更：

- 表單綁定的集合格式（`multi`、`csv`、`ssv`、`tsv`、`pipes`）在 v1.11 左右得到增強。
- 集合的預設值在 v1.11 中新增（PR #4048）。
