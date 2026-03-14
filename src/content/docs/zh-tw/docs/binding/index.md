---
title: "資料綁定"
sidebar:
  order: 4
---

Gin 提供了強大的綁定系統，可以將請求資料解析到 Go 結構體中並自動進行驗證。你不需要手動呼叫 `c.PostForm()` 或讀取 `c.Request.Body`，只需定義帶有標籤的結構體，讓 Gin 來完成工作。

## Bind 與 ShouldBind

Gin 提供兩類綁定方法：

| 方法 | 錯誤時 | 使用時機 |
|--------|----------|----------|
| `c.Bind`、`c.BindJSON` 等 | 自動呼叫 `c.AbortWithError(400, err)` | 你希望 Gin 處理錯誤回應 |
| `c.ShouldBind`、`c.ShouldBindJSON` 等 | 回傳錯誤讓你自行處理 | 你想要自訂錯誤回應 |

在大多數情況下，**建議使用 `ShouldBind`** 以獲得更多的錯誤處理控制權。

## 快速範例

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

## 支援的格式

Gin 可以從多種來源綁定資料：**JSON**、**XML**、**YAML**、**TOML**、**表單資料**（URL 編碼和 multipart）、**查詢字串**、**URI 參數**和**標頭**。使用對應的結構體標籤（`json`、`xml`、`yaml`、`form`、`uri`、`header`）來映射欄位。驗證規則放在 `binding` 標籤中，使用 [go-playground/validator](https://github.com/go-playground/validator) 語法。

## 本節內容

- [**模型綁定與驗證**](./model-binding-and-validation/) -- 核心綁定概念與驗證規則
- [**自訂驗證器**](./custom-validators/) -- 註冊自訂的驗證函式
- [**綁定查詢字串或 POST 資料**](./bind-query-or-post/) -- 從查詢字串和表單主體綁定
- [**綁定 URI**](./bind-uri/) -- 將路徑參數綁定到結構體
- [**綁定標頭**](./bind-header/) -- 將 HTTP 標頭綁定到結構體
- [**預設值**](./default-value/) -- 為缺失欄位設定備用值
- [**集合格式**](./collection-format/) -- 處理陣列查詢參數
- [**自訂反序列化器**](./custom-unmarshaler/) -- 實作自訂的反序列化邏輯
- [**綁定 HTML 核取方塊**](./bind-html-checkboxes/) -- 處理核取方塊表單輸入
- [**Multipart/urlencoded 綁定**](./multipart-urlencoded-binding/) -- 綁定 multipart 表單資料
- [**自訂結構體標籤**](./custom-struct-tag/) -- 使用自訂結構體標籤進行欄位映射
- [**嘗試將請求主體綁定到不同結構體**](./bind-body-into-different-structs/) -- 多次解析請求主體
