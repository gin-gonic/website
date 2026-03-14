---
title: "Hata işleme ara katmanı"
sidebar:
  order: 4
---

Tipik bir RESTful uygulamada herhangi bir rotada şu hatalarla karşılaşabilirsiniz:

- Kullanıcıdan geçersiz girdi
- Veritabanı hataları
- Yetkisiz erişim
- Dahili sunucu hataları

Varsayılan olarak, Gin her rotada `c.Error(err)` kullanarak hataları manuel olarak işlemenize izin verir.
Ancak bu hızla tekrarlayıcı ve tutarsız hale gelebilir.

Bunu çözmek için, tüm hataları tek bir yerde işlemek üzere özel ara katman kullanabiliriz.
Bu ara katman her istekten sonra çalışır ve Gin context'ine (`c.Errors`) eklenen hataları kontrol eder.
Birini bulursa, uygun durum koduyla yapılandırılmış bir JSON yanıtı gönderir.

#### Örnek

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

#### Uzantılar

- Hataları durum kodlarıyla eşleme
- Hata kodlarına göre farklı hata yanıtları oluşturma
- Hataları kullanarak loglama

#### Hata İşleme Ara Katmanının Faydaları

- **Tutarlılık**: Tüm hatalar aynı formatı takip eder
- **Temiz rotalar**: İş mantığı hata biçimlendirmesinden ayrılır
- **Daha az tekrar**: Her işleyicide hata işleme mantığını tekrarlamaya gerek yoktur
