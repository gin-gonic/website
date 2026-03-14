---
title: "File tunggal"
sidebar:
  order: 1
---

Merujuk pada issue [#774](https://github.com/gin-gonic/gin/issues/774) dan detail [contoh kode](https://github.com/gin-gonic/examples/tree/master/upload-file/single).

`file.Filename` **TIDAK BOLEH** dipercaya begitu saja. Lihat [`Content-Disposition` di MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) dan [#1693](https://github.com/gin-gonic/gin/issues/1693)

> Nama file selalu opsional dan tidak boleh digunakan secara membabi buta oleh aplikasi: informasi path harus dihapus, dan konversi ke aturan sistem file server harus dilakukan.

```go
func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // single file
    file, _ := c.FormFile("file")
    log.Println(file.Filename)

    // Upload the file to specific dst.
    c.SaveUploadedFile(file, "./files/" + file.Filename)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })
  router.Run(":8080")
}
```

Cara menggunakan `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
