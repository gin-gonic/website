---
title: "Menggunakan middleware"
---

```go
func main() {
  // Membuat router tanpa middleware bawaan apapun
  router := gin.New()

  // Middleware global
  // Middleware Logger akan menulis log ke gin.DefaultWriter bahkan jika Anda mengaturnya dengan GIN_MODE=release.
  // Secara bawaan gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Middleware Recovery memulihkan setiap panic dan menulis 500 jika ada.
  router.Use(gin.Recovery())

  // Middleware per rute, Anda dapat menambahkan sebanyak yang Anda inginkan.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Grup otorisasi
  // authorized := r.Group("/", AuthRequired())
  // sama persis seperti:
  authorized := router.Group("/")
  // middleware per grup! dalam hal ini kita menggunakan middleware khusus yang telah dibuat
  // AuthRequired() hanya di grup "authorized".
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // grup bersarang
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Jalankan server pada 0.0.0.0:8080
  router.Run(":8080")
}
```

