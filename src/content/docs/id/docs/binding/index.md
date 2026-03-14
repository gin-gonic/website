---
title: "Binding"
sidebar:
  order: 4
---

Gin menyediakan sistem binding yang powerful yang mem-parse data permintaan ke dalam struct Go dan memvalidasinya secara otomatis. Alih-alih memanggil `c.PostForm()` secara manual atau membaca `c.Request.Body`, Anda mendefinisikan struct dengan tag dan membiarkan Gin mengerjakannya.

## Bind vs ShouldBind

Gin menawarkan dua keluarga metode binding:

| Metode | Saat error | Gunakan ketika |
|--------|------------|----------------|
| `c.Bind`, `c.BindJSON`, dll. | Memanggil `c.AbortWithError(400, err)` secara otomatis | Anda ingin Gin menangani respons error |
| `c.ShouldBind`, `c.ShouldBindJSON`, dll. | Mengembalikan error untuk Anda tangani | Anda ingin respons error kustom |

Dalam kebanyakan kasus, **gunakan `ShouldBind`** untuk kontrol lebih atas penanganan error.

## Contoh cepat

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## Format yang didukung

Gin dapat mengikat data dari berbagai sumber: **JSON**, **XML**, **YAML**, **TOML**, **form data** (URL-encoded dan multipart), **query string**, **parameter URI**, dan **header**. Gunakan tag struct yang sesuai (`json`, `xml`, `yaml`, `form`, `uri`, `header`) untuk memetakan field. Aturan validasi ditempatkan di tag `binding` dan menggunakan sintaks [go-playground/validator](https://github.com/go-playground/validator).

## Dalam bagian ini

- [**Model binding dan validasi**](./model-binding-and-validation/) -- Konsep inti binding dan aturan validasi
- [**Validator kustom**](./custom-validators/) -- Mendaftarkan fungsi validasi Anda sendiri
- [**Binding query string atau post data**](./bind-query-or-post/) -- Binding dari query string dan body form
- [**Bind URI**](./bind-uri/) -- Mengikat parameter path ke dalam struct
- [**Bind header**](./bind-header/) -- Mengikat header HTTP ke dalam struct
- [**Nilai default**](./default-value/) -- Menetapkan nilai fallback untuk field yang hilang
- [**Format koleksi**](./collection-format/) -- Menangani parameter query array
- [**Unmarshaler kustom**](./custom-unmarshaler/) -- Mengimplementasikan logika deserialisasi kustom
- [**Bind checkbox HTML**](./bind-html-checkboxes/) -- Menangani input form checkbox
- [**Binding multipart/urlencoded**](./multipart-urlencoded-binding/) -- Mengikat data form multipart
- [**Tag struct kustom**](./custom-struct-tag/) -- Menggunakan tag struct kustom untuk pemetaan field
- [**Mencoba bind body ke struct berbeda**](./bind-body-into-different-structs/) -- Mem-parse body permintaan lebih dari sekali
