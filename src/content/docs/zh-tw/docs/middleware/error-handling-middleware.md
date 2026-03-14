---
title: "錯誤處理中介軟體"
sidebar:
  order: 4
---

在典型的 RESTful 應用程式中，你可能會在任何路由中遇到錯誤，例如：

- 使用者的無效輸入
- 資料庫故障
- 未經授權的存取
- 內部伺服器錯誤

預設情況下，Gin 允許你在每個路由中使用 `c.Error(err)` 手動處理錯誤。
但這很快就會變得重複且不一致。

為了解決這個問題，我們可以使用自訂中介軟體在一個地方處理所有錯誤。
此中介軟體在每次請求後執行，並檢查 Gin 上下文（`c.Errors`）中是否有任何錯誤。
如果找到錯誤，它會發送一個結構化的 JSON 回應，附帶適當的狀態碼。

#### 範例

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

#### 擴充功能

- 將錯誤映射到狀態碼
- 根據錯誤碼生成不同的錯誤回應
- 使用日誌記錄錯誤

#### 錯誤處理中介軟體的優點

- **一致性**：所有錯誤遵循相同格式
- **清潔路由**：業務邏輯與錯誤格式化分離
- **減少重複**：不需要在每個處理函式中重複錯誤處理邏輯
