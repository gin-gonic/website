---
title: "绑定 URI"
sidebar:
  order: 7
---

`ShouldBindUri` 使用 `uri` 结构体标签将 URI 路径参数直接绑定到结构体中。结合 `binding` 验证标签，这让你可以通过一次调用来验证路径参数（例如要求有效的 UUID）。

当你的路由包含结构化数据时（如资源 ID 或 slug），需要在使用前进行验证和类型检查，这将非常有用。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  ID   string `uri:"id" binding:"required,uuid"`
  Name string `uri:"name" binding:"required"`
}

func main() {
  route := gin.Default()

  route.GET("/:name/:id", func(c *gin.Context) {
    var person Person
    if err := c.ShouldBindUri(&person); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": person.Name, "uuid": person.ID})
  })

  route.Run(":8088")
}
```

## 测试

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
`uri` 结构体标签名称必须与路由定义中的参数名称匹配。例如，路由中的 `:id` 对应结构体中的 `uri:"id"`。
:::

## 另请参阅

- [路径参数](/zh-cn/docs/routing/param-in-path/)
- [绑定和验证](/zh-cn/docs/binding/binding-and-validation/)
