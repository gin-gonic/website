---
title: "JSONP"
---

Menggunakan JSONP untuk permintaan data dari server di domain yang berbeda. Tambahkan `callback` ke body respons jika parameter kueri `callback` ada.

```go
func main() {
  router := gin.Default()

  router.GET("/JSONP?callback=x", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // GET /JSONP?callback=x
    // callback adalah x
    // Akan menghasilkan  :   x({"foo":"bar"})
    c.JSONP(http.StatusOK, data)
  })

  // jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```