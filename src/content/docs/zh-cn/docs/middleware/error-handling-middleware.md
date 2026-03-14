---
title: "错误处理中间件"
sidebar:
  order: 4
---

在典型的 RESTful 应用中，你可能会在任何路由中遇到错误，例如：

- 用户输入无效
- 数据库故障
- 未授权访问
- 内部服务器错误

默认情况下，Gin 允许你在每个路由中使用 `c.Error(err)` 手动处理错误。
但这很快会变得重复且不一致。

为了解决这个问题，我们可以使用自定义中间件在一个地方处理所有错误。
该中间件在每个请求之后运行，检查添加到 Gin 上下文（`c.Errors`）中的任何错误。
如果找到错误，它会发送一个带有正确状态码的结构化 JSON 响应。

#### 示例

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### 扩展

- 将错误映射到状态码
- 基于错误码生成不同的错误响应
- 记录错误日志

#### 错误处理中间件的优势

- **一致性**：所有错误遵循相同的格式
- **路由更清晰**：业务逻辑与错误格式化分离
- **减少重复**：无需在每个处理函数中重复错误处理逻辑
