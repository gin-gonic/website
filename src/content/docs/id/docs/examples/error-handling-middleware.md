---
title: "Middleware penanganan error"
---

Dalam aplikasi RESTful pada umumnya, Anda mungkin akan menemui error di route seperti:

- Input tidak valid dari pengguna
- Kegagalan database
- Akses tidak sah
- Bug internal pada server

Secara bawaan, Gin memungkinkan Anda untuk menangani error secara manual di setiap route menggunakan `c.Error(err)`.
Namun, cara ini bisa dengan cepat menjadi repetitif dan tidak konsisten.

Untuk mengatasi hal ini, kita dapat menggunakan middleware khusus untuk menangani semua error di satu tempat.
Middleware ini berjalan setelah setiap permintaan dan memeriksa setiap error yang ditambahkan ke dalam context Gin (`c.Errors`).
Jika menemukan error, middleware akan mengirimkan respons JSON yang terstruktur dengan kode status yang sesuai.

#### Contoh

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler menangkap error dan mengembalikan respons error JSON yang konsisten
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Langkah 1: Proses permintaan terlebih dahulu.

        // Langkah 2: Periksa apakah ada error yang ditambahkan ke dalam context
        if len(c.Errors) > 0 {
            // Langkah 3: Gunakan error terakhir
            err := c.Errors.Last().Err

            // Langkah 4: Tanggapi dengan pesan error generik
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Langkah lain jika tidak ada error yang ditemukan
    }
}

func main() {
    r := gin.Default()

    // Pasang middleware penanganan error
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### Ekstensi

- Memetakan error ke kode status
- Menghasilkan respons error yang berbeda berdasarkan kode error
- Gunakan log error

#### Manfaat Middleware Penanganan Error

- **Konsistensi**: Semua error mengikuti format yang sama
- **Route yang bersih**: Logika bisnis terpisah dari format error
- **Lebih sedikit duplikasi**: Tidak perlu mengulang logika penanganan error di setiap handler
