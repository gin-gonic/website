---
title: "数据绑定"
sidebar:
  order: 4
---

Gin 提供了强大的绑定系统，可以将请求数据解析到 Go 结构体中并自动验证。你无需手动调用 `c.PostForm()` 或读取 `c.Request.Body`，只需定义一个带标签的结构体，让 Gin 来完成工作。

## Bind 与 ShouldBind

Gin 提供了两组绑定方法：

| 方法 | 出错时 | 使用场景 |
|--------|----------|----------|
| `c.Bind`、`c.BindJSON` 等 | 自动调用 `c.AbortWithError(400, err)` | 希望 Gin 处理错误响应 |
| `c.ShouldBind`、`c.ShouldBindJSON` 等 | 返回错误由你处理 | 希望自定义错误响应 |

大多数情况下，**推荐使用 `ShouldBind`** 以获得更好的错误处理控制。

## 快速示例

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## 支持的格式

Gin 可以从多种来源绑定数据：**JSON**、**XML**、**YAML**、**TOML**、**表单数据**（URL 编码和 multipart）、**查询字符串**、**URI 参数**和**请求头**。使用相应的结构体标签（`json`、`xml`、`yaml`、`form`、`uri`、`header`）来映射字段。验证规则放在 `binding` 标签中，使用 [go-playground/validator](https://github.com/go-playground/validator) 语法。

## 本节内容

- [**模型绑定和验证**](./binding-and-validation/) -- 核心绑定概念和验证规则
- [**自定义验证器**](./custom-validators/) -- 注册自己的验证函数
- [**绑定查询字符串或 POST 数据**](./bind-query-or-post/) -- 从查询字符串和表单体绑定
- [**绑定 URI**](./bind-uri/) -- 将路径参数绑定到结构体
- [**绑定请求头**](./bind-header/) -- 将 HTTP 请求头绑定到结构体
- [**默认值**](./default-value/) -- 为缺失字段设置回退值
- [**集合格式**](./collection-format/) -- 处理数组查询参数
- [**自定义反序列化器**](./custom-unmarshaler/) -- 实现自定义反序列化逻辑
- [**绑定 HTML 复选框**](./bind-html-checkboxes/) -- 处理复选框表单输入
- [**Multipart/urlencoded 绑定**](./multipart-urlencoded-binding/) -- 绑定 multipart 表单数据
- [**自定义结构体标签**](./custom-struct-tag/) -- 使用自定义结构体标签进行字段映射
- [**将请求体绑定到不同的结构体**](./bind-body-into-different-structs/) -- 多次解析请求体
