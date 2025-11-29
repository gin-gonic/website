---
title: "SecureJSON"
---

Menggunakan SecureJSON untuk mencegah pembajakan JSON. Secara bawaan, ini akan menambahkan `"while(1),"` di awal isi respons jika struct yang diberikan adalah nilai array.

```go
func main() {
  router := gin.Default()

  // Anda juga dapat menggunakan prefiks JSON keamanan Anda sendiri.
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Keluarannya akan  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```
