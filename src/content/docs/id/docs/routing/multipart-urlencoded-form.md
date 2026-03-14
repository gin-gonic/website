---
title: "Form Multipart/Urlencoded"
sidebar:
  order: 4
---

Gunakan `c.PostForm()` dan `c.DefaultPostForm()` untuk membaca nilai dari pengiriman form. Metode ini bekerja dengan tipe konten `application/x-www-form-urlencoded` dan `multipart/form-data` -- dua cara standar browser mengirim data form.

- `c.PostForm("field")` mengembalikan nilai atau string kosong jika field tidak ada.
- `c.DefaultPostForm("field", "fallback")` mengembalikan nilai atau default yang ditentukan jika field tidak ada.

```go
func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

### Coba jalankan

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
```

## Lihat juga

- [Upload file](/id/docs/routing/upload-file/)
- [Query dan post form](/id/docs/routing/query-and-post-form/)
