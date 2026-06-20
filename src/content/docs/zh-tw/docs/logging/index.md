---
title: "日誌記錄"
sidebar:
  order: 7
---

Gin 內含一個日誌記錄中介軟體，記錄每個 HTTP 請求的詳細資訊，包括狀態碼、HTTP 方法、路徑和延遲時間。

當你使用 `gin.Default()` 建立路由器時，日誌記錄中介軟體會與恢復中介軟體一起自動附加：

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

如果你需要完全控制使用哪些中介軟體，請使用 `gin.New()` 建立路由器並手動新增日誌記錄器：

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

預設的日誌記錄器寫入 `os.Stdout`，每個請求產生如下輸出：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

每個條目包含時間戳、HTTP 狀態碼、請求延遲時間、客戶端 IP、HTTP 方法和請求的路徑。

## 本節內容

- [**將日誌寫入檔案**](./write-log/) -- 將日誌輸出重新導向到檔案、主控台或同時導向到兩者。
- [**自訂日誌格式**](./custom-log-format/) -- 使用 `LoggerWithFormatter` 定義自訂的日誌格式。
- [**跳過日誌記錄**](./skip-logging/) -- 對特定路徑或條件跳過日誌記錄。
- [**控制日誌輸出著色**](./controlling-log-output-coloring/) -- 啟用或停用彩色日誌輸出。
- [**避免記錄查詢字串**](./avoid-logging-query-strings/) -- 從日誌輸出中移除查詢參數以確保安全和隱私。
- [**定義路由日誌的格式**](./define-format-for-the-log-of-routes/) -- 自訂啟動時列印已註冊路由的方式。
