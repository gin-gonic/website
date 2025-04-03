---
title: "Controlando a Colorização da Saída de Registo"
draft: false
---

Por padrão, a saída de registos na consola deveria ser colorida dependendo do TTY detetado.

Nunca colorir os registos:

```go
func main() {
    // Desativar a cor do registo
    gin.DisableConsoleColor()
    
    // Criar um roteador de Gin com o intermediário padrão:
    // registador e intermediário de recuperação (livre de avaria)
    router := gin.Default()
    
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })
    
    router.Run(":8080")
}
```

Sempre colorir os registos:

```go
func main() {
    // Forçar a cor do registo
    gin.ForceConsoleColor()
    
    // Criar um roteador de Gin com o intermediário padrão:
    // registador e intermediário de recuperação (livre de avaria)
    router := gin.Default()
    
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })
    
    router.Run(":8080")
}
```
