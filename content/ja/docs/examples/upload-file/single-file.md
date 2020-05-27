---
title: "単一のファイル"
draft: false
---

issue [#774](https://github.com/gin-gonic/gin/issues/774) と、詳細は [サンプルコード](https://github.com/gin-gonic/examples/tree/master/upload-file/single) 参照。

`file.Filename` を信用する**べきではありません**。 [MDN の `Content-Disposition`](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Disposition#Directives) と [#1693](https://github.com/gin-gonic/gin/issues/1693) を参照。

> ファイル名は常にオプションであり、アプリケーションで闇雲に使用しないでください。パス情報を削除し、サーバーのファイルシステムルールに変換すべきです。

```go
func main() {
	router := gin.Default()
	// マルチパートフォームが利用できるメモリの制限を設定する(デフォルトは 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// 単一のファイル
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// 特定のディレクトリにファイルをアップロードする
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

`curl` での使い方:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```

