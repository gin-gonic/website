---
title: "檔案上傳"
sidebar:
  label: "檔案上傳"
  order: 7
---

Gin 讓處理 multipart 檔案上傳變得簡單直覺。框架在 `gin.Context` 上提供了內建方法來接收上傳的檔案：

- **`c.FormFile(name)`** -- 根據表單欄位名稱從請求中取得單一檔案。
- **`c.MultipartForm()`** -- 解析整個 multipart 表單，提供對所有上傳檔案和欄位值的存取。
- **`c.SaveUploadedFile(file, dst)`** -- 便捷方法，將接收到的檔案儲存到磁碟上的目標路徑。

### 記憶體限制

Gin 透過 `router.MaxMultipartMemory` 為 multipart 表單解析設定了預設 **32 MiB** 的記憶體限制。在此限制內的檔案會緩衝在記憶體中；超出的部分會寫入磁碟上的臨時檔案。你可以根據應用程式的需求調整此值：

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### 安全提示

客戶端回報的檔名（`file.Filename`）**不應被信任**。在檔案系統操作中使用前，請務必進行清理或替換。詳情請參閱 [MDN 上的 Content-Disposition 文件](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)。

### 子頁面

- [**單一檔案**](./single-file/) -- 每次請求上傳並儲存一個檔案。
- [**多個檔案**](./multiple-file/) -- 在一次請求中上傳並儲存多個檔案。
- [**限制上傳大小**](./limit-bytes/) -- 使用 `http.MaxBytesReader` 限制上傳大小。
