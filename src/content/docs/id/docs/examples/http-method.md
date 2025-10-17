---
title: "Menggunakan metode HTTP"
---

```go
func main() {
  // Membuat router gin dengan middleware bawaan:
  // middleware logger dan pemulihan (bebas-mogok)
  router := gin.Default()

  router.GET("/someGet", getting)
  router.POST("/somePost", posting)
  router.PUT("/somePut", putting)
  router.DELETE("/someDelete", deleting)
  router.PATCH("/somePatch", patching)
  router.HEAD("/someHead", head)
  router.OPTIONS("/someOptions", options)

  // Secara bawaan, server berjalan di :8080 kecuali variabel
  // lingkungan PORT didefinisikan.
  router.Run()
  // router.Run(":3000") untuk port yang ditulis secara hardcode
}
```