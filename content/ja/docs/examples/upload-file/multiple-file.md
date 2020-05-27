---
title: "複数のファイル"
draft: false
---

詳細は [サンプルコード](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple) 参照のこと.

```go
func main() {
	router := gin.Default()
	// マルチパートフォームが利用できるメモリの制限を設定する(デフォルトは 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// マルチパートフォーム
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)

			// 特定のディレクトリにファイルをアップロードする
			c.SaveUploadedFile(file, dst)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})
	router.Run(":8080")
}
```

`curl` での使い方:

```sh
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
