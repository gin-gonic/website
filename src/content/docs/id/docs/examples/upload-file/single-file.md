---
title: "File tunggal"
---

Merujuk pada isu [#774](https://github.com/gin-gonic/gin/issues/774) dan detail [contoh kode](https://github.com/gin-gonic/examples/tree/master/upload-file/single).

`file.Filename` **TIDAK BOLEH** dipercaya. Lihat [`Content-Disposition` di MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) dan [#1693](https://github.com/gin-gonic/gin/issues/1693)

> Nama file selalu bersifat opsional dan tidak boleh digunakan begitu saja oleh aplikasi: informasi path harus dihilangkan, dan perlu dilakukan konversi sesuai aturan sistem file di server.

```go
func main() {
  router := gin.Default()
  // Atur batas memori yang lebih rendah untuk multipart form (bawaan 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // file tunggal
    file, _ := c.FormFile("file")
    log.Println(file.Filename)

    // Unggah file ke tujuan spesifik
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
