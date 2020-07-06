---
title: "Como registrar un Log en un archivo"
draft: false
---

```go
func main() {
    // Deshabilita el color en la cónsola. Es innecesario si se desea registrar los logs en un archivo.
    gin.DisableConsoleColor()

    // Declarando el archivo del Log.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Utilice el siguiente código si necesita registrar el log en un archivo y en la cónsola al mismo tiempo.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```
