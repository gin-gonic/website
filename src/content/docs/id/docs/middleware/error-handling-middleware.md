---
title: "Middleware penanganan error"
sidebar:
  order: 4
---

Dalam aplikasi RESTful tipikal, Anda mungkin menemui error di rute mana pun seperti:

- Input tidak valid dari pengguna
- Kegagalan database
- Akses tidak sah
- Bug server internal

Secara default, Gin memungkinkan Anda menangani error secara manual di setiap rute menggunakan `c.Error(err)`.
Tetapi ini bisa cepat menjadi berulang dan tidak konsisten.

Untuk mengatasi ini, kita dapat menggunakan middleware kustom untuk menangani semua error di satu tempat.
Middleware ini berjalan setelah setiap permintaan dan memeriksa error yang ditambahkan ke context Gin (`c.Errors`).
Jika ditemukan, middleware mengirim respons JSON terstruktur dengan kode status yang tepat.

#### Contoh

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
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
- Menghasilkan respons error berbeda berdasarkan kode error
- Mencatat error menggunakan logger

#### Manfaat Middleware Penanganan Error

- **Konsistensi**: Semua error mengikuti format yang sama
- **Rute bersih**: Logika bisnis terpisah dari pemformatan error
- **Lebih sedikit duplikasi**: Tidak perlu mengulang logika penanganan error di setiap handler
