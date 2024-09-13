---
title: "Servir os Ficheiros Estáticos"

---

```go
func main() {
	router := gin.Default()
	router.Static("/assets", "./assets")
	router.StaticFS("/more_static", http.Dir("my_file_system"))
	router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	// ouvir e servir no 0.0.0.0:8080
	router.Run(":8080")
}
```
