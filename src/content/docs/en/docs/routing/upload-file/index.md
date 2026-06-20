---
title: "Upload files"
sidebar:
  label: "Upload Files"
  order: 7
---

Gin makes it straightforward to handle multipart file uploads. The framework provides built-in methods on `gin.Context` for receiving uploaded files:

- **`c.FormFile(name)`** -- Retrieves a single file from the request by form field name.
- **`c.MultipartForm()`** -- Parses the entire multipart form, giving access to all uploaded files and field values.
- **`c.SaveUploadedFile(file, dst)`** -- A convenience method that saves a received file to a destination path on disk.

### Memory limit

Gin sets a default memory limit of **32 MiB** for multipart form parsing via `router.MaxMultipartMemory`. Files within this limit are buffered in memory; anything beyond it is written to temporary files on disk. You can adjust this value to suit your application's needs:

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### Security note

The filename reported by the client (`file.Filename`) **should not** be trusted. Always sanitize or replace it before using it in file system operations. See the [Content-Disposition documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) for details.

### Sub-pages

- [**Single file**](./single-file/) -- Upload and save a single file per request.
- [**Multiple files**](./multiple-file/) -- Upload and save multiple files in one request.
- [**Limit upload size**](./limit-bytes/) -- Restrict upload size using `http.MaxBytesReader`.
