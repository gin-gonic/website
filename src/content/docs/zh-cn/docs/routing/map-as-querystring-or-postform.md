---
title: "Map 作为查询字符串或表单参数"
sidebar:
  order: 6
---

有时你需要接收一组事先不知道键名的键值对——例如动态过滤器或用户定义的元数据。Gin 提供了 `c.QueryMap` 和 `c.PostFormMap` 来将方括号表示法的参数（如 `ids[a]=1234`）解析为 `map[string]string`。

- `c.QueryMap("key")` —— 从 URL 查询字符串中解析 `key[subkey]=value` 形式的键值对。
- `c.PostFormMap("key")` —— 从请求体中解析 `key[subkey]=value` 形式的键值对。

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    ids := c.QueryMap("ids")
    names := c.PostFormMap("names")

    fmt.Printf("ids: %v; names: %v\n", ids, names)
    c.JSON(http.StatusOK, gin.H{
      "ids":   ids,
      "names": names,
    })
  })

  router.Run(":8080")
}
```

## 测试

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
方括号表示法 `ids[a]=1234` 是一种常见约定。Gin 将方括号内的部分解析为 map 的键。仅支持单层方括号——嵌套方括号如 `ids[a][b]=value` 不会被解析为嵌套 map。
:::

## 另请参阅

- [查询字符串参数](/zh-cn/docs/routing/querystring-param/)
- [查询字符串和表单](/zh-cn/docs/routing/query-and-post-form/)
