---
title: "Menyajikan file statis"
---

```go
func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```
