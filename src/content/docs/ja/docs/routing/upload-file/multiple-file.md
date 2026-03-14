---
title: "複数ファイル"
sidebar:
  order: 2
---

詳細は[サンプルコード](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple)を参照してください。

```go
func main() {
  router := gin.Default()
  // multipartフォームのメモリ制限を低く設定（デフォルトは32 MiB）
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // Multipartフォーム
    form, _ := c.MultipartForm()
    files := form.File["files"]

    for _, file := range files {
      log.Println(file.Filename)

      // ファイルを指定の場所にアップロード
      c.SaveUploadedFile(file, "./files/" + file.Filename)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })
  router.Run(":8080")
}
```

`curl`の使い方：

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/Users/appleboy/test1.zip" \
  -F "files=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
