---
title: "文件上传"
sidebar:
  order: 7
---

Gin 使处理 multipart 文件上传变得简单直接。框架在 `gin.Context` 上提供了内置方法来接收上传的文件：

- **`c.FormFile(name)`** -- 通过表单字段名从请求中获取单个文件。
- **`c.MultipartForm()`** -- 解析整个 multipart 表单，可以访问所有上传的文件和字段值。
- **`c.SaveUploadedFile(file, dst)`** -- 一个便捷方法，将接收到的文件保存到磁盘上的目标路径。

### 内存限制

Gin 为 multipart 表单解析设置了默认 **32 MiB** 的内存限制，通过 `router.MaxMultipartMemory` 设置。在此限制内的文件会缓存在内存中；超出的部分会写入磁盘上的临时文件。你可以根据应用需求调整此值：

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### 安全提示

客户端报告的文件名（`file.Filename`）**不应该**被信任。在文件系统操作中使用之前，请始终对其进行清理或替换。详情请参阅 [MDN 上的 Content-Disposition 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)。

### 子页面

- [**单文件**](./single-file/) -- 每个请求上传并保存单个文件。
- [**多文件**](./multiple-file/) -- 在一个请求中上传并保存多个文件。
- [**限制上传大小**](./limit-bytes/) -- 使用 `http.MaxBytesReader` 限制上传大小。
