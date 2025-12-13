---
title: "PureJSON"
---

Biasanya, JSON mengganti karakter HTML spesial dengan entitas unicode-nya, misal `<` menjadi `\u003c`. Jika Anda ingin melakukan enkode karakter tersebut secara harfiah, Anda dapat menggunakan PureJSON sebagai gantinya.
Fitur ini tidak tersedia di Go 1.6 dan yang lebih rendah.

```go
func main() {
  router := gin.Default()
  
  // Menyajikan entitas unicode
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })
  
  // Menyajikan karakter harfiah
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // Batalkan lebih awal dengan respons PureJSON dan kode status (v1.11+)
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```
