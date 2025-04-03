---
title: "Como Escrever Ficheiro de Registo"

---

```go
func main() {
    // desativar a cor da consola, não precisas de cor de consola quando
    // escreves registos em um ficheiro.
    gin.DisableConsoleColor()

    // registando num ficheiro.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // use o seguinte código se precisares de escrever registos num ficheiro e
    // imprimir na consola ao mesmo tempo.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```
