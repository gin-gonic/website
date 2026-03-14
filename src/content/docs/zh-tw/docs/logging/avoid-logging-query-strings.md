---
title: "避免記錄查詢字串"
sidebar:
  order: 5
---

查詢字串通常包含敏感資訊，如 API 令牌、密碼、Session ID 或個人識別資訊（PII）。記錄這些值可能產生安全風險，並可能違反 GDPR 或 HIPAA 等隱私法規。透過從日誌中移除查詢字串，你可以降低透過日誌檔案、監控系統或錯誤回報工具洩露敏感資料的機會。

使用 `LoggerConfig` 中的 `SkipQueryString` 選項來防止查詢字串出現在日誌中。啟用後，對 `/path?token=secret&user=alice` 的請求將僅記錄為 `/path`。

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

你可以用 `curl` 測試差異：

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

不使用 `SkipQueryString` 時，日誌條目包含完整的查詢字串：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

使用 `SkipQueryString: true` 時，查詢字串會被移除：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

這在合規敏感的環境中特別有用，其中日誌輸出被轉發到第三方服務或長期儲存。你的應用程式仍可透過 `c.Query()` 完全存取查詢參數——僅日誌輸出受到影響。
