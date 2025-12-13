---
title: "绑定表单字段的默认值"
---

有时候你希望当客户端没有发送值时，字段能够回退到默认值。Gin 的表单绑定通过 `form` 结构体标签中的 `default` 选项支持默认值。这适用于标量类型，从 Gin v1.11 开始，也适用于具有显式集合格式的集合（切片/数组）。

关键点：

- 将默认值放在表单键的后面：`form:"name,default=William"`。
- 对于集合，使用 `collection_format:"multi|csv|ssv|tsv|pipes"` 指定值的分隔方式。
- 对于 `multi` 和 `csv`，在默认值中使用分号分隔值（例如 `default=1;2;3`）。Gin 会在内部将其转换为逗号，以保持标签解析器的明确性。
- 对于 `ssv`（空格）、`tsv`（制表符）和 `pipes`（|），在默认值中使用自然分隔符。

示例：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv：在默认值中使用 ;
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // 根据 Content-Type 推断绑定器
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

如果你发送没有请求体的 POST 请求，Gin 会使用默认值响应：

```sh
curl -X POST http://localhost:8080/person
```

响应（示例）：

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

注意事项：

- 逗号在 Go 结构体标签语法中用于分隔选项；避免在默认值中使用逗号。
- 对于 `multi` 和 `csv`，分号用于分隔默认值；不要在这些格式的单个默认值中包含分号。
- 无效的 `collection_format` 值将导致绑定错误。

相关变更：

- 表单绑定的集合格式（`multi`、`csv`、`ssv`、`tsv`、`pipes`）在 v1.11 左右得到增强。
- 集合的默认值在 v1.11 中添加（PR #4048）。
