---
title: "単一ファイル"
sidebar:
  order: 1
---

Issue [#774](https://github.com/gin-gonic/gin/issues/774)を参照し、[サンプルコード](https://github.com/gin-gonic/examples/tree/master/upload-file/single)の詳細をご確認ください。

`file.Filename`は**信頼すべきではありません**。[MDNの`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)と[#1693](https://github.com/gin-gonic/gin/issues/1693)を参照してください。

> ファイル名は常にオプションであり、アプリケーションで盲目的に使用してはいけません。パス情報は除去し、サーバーのファイルシステムルールへの変換を行う必要があります。

```go
func main() {
  router := gin.Default()
  // multipartフォームのメモリ制限を低く設定（デフォルトは32 MiB）
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // 単一ファイル
    file, _ := c.FormFile("file")
    log.Println(file.Filename)

    // ファイルを指定の場所にアップロード
    c.SaveUploadedFile(file, "./files/" + file.Filename)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })
  router.Run(":8080")
}
```

`curl`の使い方：

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
